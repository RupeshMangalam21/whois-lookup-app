"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Search, Globe, Users } from "lucide-react"

interface DomainInfo {
  domainName: string
  registrar: string
  registrationDate: string
  expirationDate: string
  estimatedDomainAge: string
  hostnames: string
}

interface ContactInfo {
  registrantName: string
  technicalContactName: string
  administrativeContactName: string
  contactEmail: string
}

export default function WhoisLookup() {
  const [domain, setDomain] = useState("")
  const [dataType, setDataType] = useState<"domain" | "contact">("domain")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [domainInfo, setDomainInfo] = useState<DomainInfo | null>(null)
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!domain.trim()) {
      setError("Please enter a domain name")
      return
    }

    setLoading(true)
    setError("")
    setDomainInfo(null)
    setContactInfo(null)

    try {
      const response = await fetch("/api/whois", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: domain.trim(),
          type: dataType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch WHOIS data")
      }

      if (dataType === "domain") {
        setDomainInfo(data)
      } else {
        setContactInfo(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">WHOIS Domain Lookup</h1>
          <p className="text-lg text-gray-600">Get comprehensive domain information and contact details</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Domain Lookup
            </CardTitle>
            <CardDescription>Enter a domain name to retrieve registration and contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain Name</Label>
                  <Input
                    id="domain"
                    type="text"
                    placeholder="e.g., amazon.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataType">Information Type</Label>
                  <Select value={dataType} onValueChange={(value: "domain" | "contact") => setDataType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select information type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="domain">Domain Information</SelectItem>
                      <SelectItem value="contact">Contact Information</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Looking up domain...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Lookup Domain
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {domainInfo && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Domain Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Domain Name</TableHead>
                    <TableHead>Registrar</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Expiration Date</TableHead>
                    <TableHead>Estimated Domain Age</TableHead>
                    <TableHead>Hostnames</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{domainInfo.domainName}</TableCell>
                    <TableCell>{domainInfo.registrar}</TableCell>
                    <TableCell>{domainInfo.registrationDate}</TableCell>
                    <TableCell>{domainInfo.expirationDate}</TableCell>
                    <TableCell>{domainInfo.estimatedDomainAge}</TableCell>
                    <TableCell>{domainInfo.hostnames}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {contactInfo && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Registrant Name</TableHead>
                    <TableHead>Technical Contact Name</TableHead>
                    <TableHead>Administrative Contact Name</TableHead>
                    <TableHead>Contact Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{contactInfo.registrantName}</TableCell>
                    <TableCell>{contactInfo.technicalContactName}</TableCell>
                    <TableCell>{contactInfo.administrativeContactName}</TableCell>
                    <TableCell>{contactInfo.contactEmail}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <div className="text-center text-sm text-gray-500 py-4">
          <p>Powered by WhoisXMLAPI • Built with Next.js and React</p>
        </div>
      </div>
    </div>
  )
}
