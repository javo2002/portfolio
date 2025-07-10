import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Education() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <h3 className="font-semibold">The Pennsylvania State University</h3>
            <p className="text-sm text-muted-foreground">
              Bachelor of Science in Cybersecurity
            </p>
            <p className="text-sm text-muted-foreground">Aug 2020 - May 2025</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
