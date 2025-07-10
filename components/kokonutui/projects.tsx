import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Projects() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">SOC & Automation</h3>
            <p>
              Developed a SOAR EDR Lab using LimaCharlie and Tines to simulate
              automated incident response workflows. He also created an Active
              Directory Lab to implement secure infrastructure and detect
              privilege escalation using Splunk.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Framework Implementation</h3>
            <p>
              Actively working on a project to simulate the implementation of
              the NIST CSF 2.0 framework for a small business.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Network & Forensics</h3>
            <p>
              Configured advanced firewall policies using VyOS and analyzed over
              50 malicious PCAP files in his Wireshark Analysis Lab to identify
              command-and-control traffic.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Database Security</h3>
            <p>
              Developed projects integrating Splunk with SQLite for automated
              threat detection in customer databases and worked on a secure
              web-based SQL management system using PHP and MySQL.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Other Endeavors</h3>
            <p>
              Co-founded a technical blog and YouTube channel to inform the
              tech community about cybersecurity and AI trends. He also serves
              as the sole point of contact for the Nina Cheyenne Apparel Group
              for technology integration and troubleshooting.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
