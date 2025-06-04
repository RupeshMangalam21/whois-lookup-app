import { type NextRequest, NextResponse } from "next/server"

interface WhoisResponse {
  WhoisRecord: {
    domainName: string
    registrarName: string
    createdDate: string
    expiresDate: string
    estimatedDomainAge: number
    nameServers: {
      hostNames: string[]
    }
    registrant: {
      name: string
      email: string
    }
    technicalContact: {
      name: string
    }
    administrativeContact: {
      name: string
    }
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return "N/A"
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return dateString
  }
}

function formatHostnames(hostnames: string[]): string {
  if (!hostnames || hostnames.length === 0) return "N/A"

  const hostnamesStr = hostnames.join(", ")
  if (hostnamesStr.length > 25) {
    return hostnamesStr.substring(0, 22) + "..."
  }
  return hostnamesStr
}

function calculateDomainAge(createdDate: string): string {
  if (!createdDate) return "N/A"

  try {
    const created = new Date(createdDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - created.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const years = Math.floor(diffDays / 365)
    const months = Math.floor((diffDays % 365) / 30)

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""}, ${months} month${months > 1 ? "s" : ""}`
    } else {
      return `${months} month${months > 1 ? "s" : ""}`
    }
  } catch {
    return "N/A"
  }
}

export async function POST(request: NextRequest) {
  try {
    const { domain, type } = await request.json()

    if (!domain) {
      return NextResponse.json({ error: "Domain name is required" }, { status: 400 })
    }

    // Check if API key is configured
    const apiKey = process.env.WHOIS_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "WHOIS API key not configured. Please set WHOIS_API_KEY environment variable." },
        { status: 500 },
      )
    }

    // Make request to WhoisXMLAPI
    const whoisUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${apiKey}&domainName=${encodeURIComponent(domain)}&outputFormat=JSON`

    const response = await fetch(whoisUrl)

    if (!response.ok) {
      throw new Error(`WHOIS API request failed: ${response.status}`)
    }

    const data: WhoisResponse = await response.json()

    if (!data.WhoisRecord) {
      return NextResponse.json({ error: "No WHOIS data found for this domain" }, { status: 404 })
    }

    const record = data.WhoisRecord

    if (type === "domain") {
      return NextResponse.json({
        domainName: record.domainName || domain,
        registrar: record.registrarName || "N/A",
        registrationDate: formatDate(record.createdDate),
        expirationDate: formatDate(record.expiresDate),
        estimatedDomainAge: calculateDomainAge(record.createdDate),
        hostnames: formatHostnames(record.nameServers?.hostNames || []),
      })
    } else if (type === "contact") {
      return NextResponse.json({
        registrantName: record.registrant?.name || "N/A",
        technicalContactName: record.technicalContact?.name || "N/A",
        administrativeContactName: record.administrativeContact?.name || "N/A",
        contactEmail: record.registrant?.email || "N/A",
      })
    } else {
      return NextResponse.json({ error: "Invalid type. Must be 'domain' or 'contact'" }, { status: 400 })
    }
  } catch (error) {
    console.error("WHOIS API Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
