"use client";
import React, { useState } from "react";
import { ChevronRight, Car, Calendar as CalendarIcon, Shield, MapPin, Clock } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { carMakes, featuredCars, bodyTypes, faqItems } from "@/lib/data";
import { SignedOut } from "@clerk/nextjs";
import CarCard from "@/components/car-card";
import Link from "next/link";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import { AccordionItem } from "@radix-ui/react-accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useEffect } from "react";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(min-width: 768px)");
    const handler = () => setIsDesktop(m.matches);
    handler();
    m.addEventListener("change", handler);
    return () => m.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

function formatRangeLabel(r?: DateRange) {
  if (r?.from && r?.to) {
    return `${r.from.toLocaleDateString()} - ${r.to.toLocaleDateString()}`;
  }
  if (r?.from) return `${r.from.toLocaleDateString()} - …`;
  return "Testttt";
}

export default function Home() {
  const [location, setLocation] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: undefined, to: undefined });
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("10:00");
  const [driverAge, setDriverAge] = useState("25+");

  const isDesktop = useIsDesktop();

  const times = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  ];

  function onSearch() {
    // Sadece UI hazırlığı: Şimdilik bir yönlendirme/console koyuyoruz
    const query = new URLSearchParams({
      location,
      startDate: dateRange?.from ? dateRange.from.toISOString() : "",
      endDate: dateRange?.to ? dateRange.to.toISOString() : "",
      startTime,
      endTime,
      driverAge,
    }).toString();

    // İleride /cars sayfasında bu query parametreleriyle filtreleme yapılabilir
    window.location.href = `/cars?${query}`;
  }

  return (
    <div className="flex flex-col pt-20">
      {/* Rental Search */}
      <section className="relative py-8 md:py-10 bg-white">
        <div className="w-full max-w-6xl mx-auto px-4">
          <Card className="shadow-sm border rounded-2xl">
            <CardContent className="p-4 md:p-6">
              <div className="mb-4 md:mb-6">
                <h1 className="text-xl md:text-3xl font-semibold md:font-bold tracking-tight">Araç Kiralama</h1>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Lokasyon, tarih aralığı ve saatleri seçerek uygun araçları görüntüleyin.</p>
              </div>

              <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Location */}
                <div className="space-y-2 lg:col-span-2 min-w-0">
                  <Label>Lokasyon</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Şehir, havaalanı veya adres"
                      className="pl-9 w-full"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div className="space-y-2 min-w-0">
                  <Label>Tarih Aralığı</Label>
                  {isDesktop ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start w-full truncate">
                          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                          <span className="truncate">{formatRangeLabel(dateRange)}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-[720px] md:w-[760px] !max-w-none z-50" align="start" side="bottom" sideOffset={8}>
                        <div className="p-4">
                          <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                            showOutsideDays
                            fixedWeeks
                            weekStartsOn={1}
                            initialFocus
                            classNames={{
                              months: "flex gap-6",
                              month: "space-y-3",
                              caption: "flex justify-center pt-2 relative items-center",
                              caption_label: "text-sm font-medium",
                              nav: "space-x-1 flex items-center",
                              table: "w-full border-collapse",
                              head_row: "grid grid-cols-7",
                              head_cell: "text-muted-foreground w-10 h-10 font-normal text-[0.8rem]",
                              row: "grid grid-cols-7",
                              cell: "p-0",
                              day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100",
                              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                              day_today: "bg-accent text-accent-foreground",
                              day_outside: "text-muted-foreground/50 opacity-50",
                              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                              day_range_start: "day-range-start",
                              day_range_end: "day-range-end",
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="justify-start w-full truncate">
                          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                          <span className="truncate">{formatRangeLabel(dateRange)}</span>
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="bottom" className="p-0 h-[80vh]">
                        <SheetHeader className="px-6 pt-6 pb-2">
                          <SheetTitle>Tarih Aralığı</SheetTitle>
                        </SheetHeader>
                        <div className="p-4">
                          <div className="mx-auto max-w-md">
                            <Calendar
                              mode="range"
                              selected={dateRange}
                              onSelect={setDateRange}
                              numberOfMonths={1}
                              fixedWeeks
                              weekStartsOn={1}
                              initialFocus
                              classNames={{
                                table: "w-full border-collapse",
                                head_row: "grid grid-cols-7",
                                head_cell: "text-muted-foreground w-10 h-10 font-normal text-[0.8rem]",
                                row: "grid grid-cols-7",
                                cell: "p-0",
                                day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100",
                                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                                day_today: "bg-accent text-accent-foreground",
                                day_outside: "text-muted-foreground/50 opacity-50",
                                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                day_range_start: "day-range-start",
                                day_range_end: "day-range-end",
                              }}
                            />
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  )}
                </div>

                {/* Start Time */}
                <div className="space-y-2 min-w-0">
                  <Label>Alış Saati</Label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger className="w-full">
                      <Clock className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Saat" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64 overflow-auto">
                      {times.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:gap-4 md:grid-cols-3">
                {/* End Time */}
                <div className="space-y-2 min-w-0">
                  <Label>İade Saati</Label>
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger className="w-full">
                      <Clock className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Saat" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64 overflow-auto">
                      {times.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Age */}
                <div className="space-y-2 min-w-0">
                  <Label>Sürücü Yaşı</Label>
                  <Select value={driverAge} onValueChange={setDriverAge}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Yaş" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="21+">21+</SelectItem>
                      <SelectItem value="23+">23+</SelectItem>
                      <SelectItem value="25+">25+</SelectItem>
                      <SelectItem value="30+">30+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button className="w-full h-11" size="lg" onClick={onSearch}>
                    Araçları Gör
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Cars</h2>
            <Button variant="ghost" className="flex items-center" asChild>
              <Link href="/cars">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Browse by Make</h2>
            <Button variant="ghost" className="flex items-center" asChild>
              <Link href="/cars">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {carMakes.map((make) => (
              <Link
                key={make.name}
                href={`/cars?make=${make.name}`}
                className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition cursor-pointer"
              >
                <div className="h-16 w-auto mx-auto mb-2 relative">
                  <Image
                    src={
                      make.image || `/make/${make.name.toLowerCase()}.webp`
                    }
                    alt={make.name}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <h3 className="font-medium">{make.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">
            Why Choose Our Platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Thousands of verified vehicles from trusted dealerships and
                private sellers.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Test Drive</h3>
              <p className="text-gray-600">
                Book a test drive online in minutes, with flexible scheduling
                options.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Process</h3>
              <p className="text-gray-600">
                Verified listings and secure booking process for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Browse by Body Type</h2>
            <Button variant="ghost" className="flex items-center" asChild>
              <Link href="/cars">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bodyTypes.map((type) => (
              <Link
                key={type.name}
                href={`/cars?bodyType=${type.name}`}
                className="relative group cursor-pointer"
              >
                <div className="overflow-hidden rounded-lg flex justify-end h-28 mb-4 relative">
                  <Image
                    src={
                      type.image || `/body/${type.name.toLowerCase()}.webp`
                    }
                    alt={type.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg flex items-end">
                  <h3 className="text-white text-xl font-bold pl-4 pb-2 ">
                    {type.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Dream Car?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect
            vehicle through our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/cars">View All Cars</Link>
            </Button>
            <SignedOut>
              <Button size="lg" asChild>
                <Link href="/sign-up">Sign Up Now</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </section>
    </div>
  );
}