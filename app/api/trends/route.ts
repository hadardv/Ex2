import { NextResponse } from 'next/server'

let cachedData: any = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 10 * 60 * 1000 

export async function GET() {
  try {
    const now = Date.now()
    if (cachedData && now - cacheTimestamp < CACHE_DURATION) {
      console.log('Returning cached data')
      return NextResponse.json({
        data: cachedData,
        cached: true,
        cacheAge: Math.floor((now - cacheTimestamp) / 1000), // age in seconds
      })
    }

    const today = new Date()
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const formattedDate = sevenDaysAgo.toISOString().split('T')[0]

    console.log(`Fetching repos with activity after: ${formattedDate}`)

    const query = `AI stars:>100 pushed:>${formattedDate}`

   
    const githubApiUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(
      query
    )}&sort=stars&order=desc&per_page=20`

    const response = await fetch(githubApiUrl, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
      next: { revalidate: 600 },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()

    const repositories = data.items.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      url: repo.html_url,
      createdAt: repo.created_at,
      owner: {
        login: repo.owner.login,
        avatar: repo.owner.avatar_url,
      },
    }))

    // Store the data in our cache
    cachedData = repositories
    cacheTimestamp = Date.now()

    console.log(`Fetched ${repositories.length} repositories`)


    return NextResponse.json({
      data: repositories,
      cached: false,
      fetchedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching trends:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch trends',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

