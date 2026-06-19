import BookingFlow from "@/components/booking/BookingFlow";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

interface PageProps {
  searchParams: SearchParams;
}

export default async function BookingPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const caseParam = resolvedParams?.case;

  const bookingCase =
    caseParam === "unzufrieden" ||
    caseParam === "nachzahlung" ||
    caseParam === "umzug"
      ? (caseParam as "unzufrieden" | "nachzahlung" | "umzug")
      : "default";

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <BookingFlow bookingCase={bookingCase} />
    </main>
  );
}
