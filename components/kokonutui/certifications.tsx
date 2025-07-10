import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Certifications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Certifications</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc space-y-2 pl-4">
          <li>CompTIA Secure Infrastructure Specialist (CSIS)</li>
          <li>CompTIA Security+</li>
          <li>CompTIA Network+</li>
          <li>CompTIA A+</li>
          <li>Azure Fundamentals</li>
          <li>Google Cybersecurity Specialization</li>
        </ul>
      </CardContent>
    </Card>
  )
}
