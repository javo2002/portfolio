import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Experience() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div>
            <h3 className="font-semibold">
              Help Desk Support Specialist - Edward Jones (through CBIZ MSP)
            </h3>
            <p className="text-sm text-muted-foreground">
              June 2025 - Current, Remote
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-4">
              <li>
                Reduced average ticket resolution time for access-related issues
                by 35% by automating user provisioning with PowerShell scripts.
              </li>
              <li>
                Drove a 100% improvement in security compliance reporting by
                creating and implementing an automated tracking system to
                monitor over 5,000 endpoint configurations.
              </li>
              <li>
                Decreased issue escalations to senior staff by 20% through the
                authorship of more than 20 detailed knowledge base articles.
              </li>
              <li>
                Contained an active phishing campaign within 30 minutes by using
                Splunk for rapid log analysis to isolate threats.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">
              Security Analyst Intern - Pennsylvania State University
            </h3>
            <p className="text-sm text-muted-foreground">
              May 2024 - August 2024, Remote
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-4">
              <li>
                Configured pfSense firewalls with custom security policies to
                reduce the simulated attack surface.
              </li>
              <li>
                Enhanced threat detection by deploying and tuning a SIEM
                Enterprise to identify and mitigate threats.
              </li>
              <li>
                Utilized Excel to track the performance of over five security
                configurations.
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
