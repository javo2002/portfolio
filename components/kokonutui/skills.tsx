import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Skills() {
  const technicalSkills = [
    "Network Troubleshooting",
    "Log Analytics",
    "TCP/IP Protocols",
    "WAN/LAN",
    "Automation",
    "Remediation",
  ]
  const tools = [
    "Active Directory",
    "Microsoft Sentinel",
    "Splunk Enterprise",
    "Splunk SOAR",
    "Python",
    "ServiceNow",
    "LimaCharlie",
    "Tines",
    "VyOS firewall",
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Skills and Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold">Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {technicalSkills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Tools</h3>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool) => (
                <Badge key={tool} variant="secondary">
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
