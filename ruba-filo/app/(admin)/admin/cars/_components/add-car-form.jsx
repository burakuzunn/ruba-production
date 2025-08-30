"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, X, Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { addCar } from "@/actions/cars";
import useFetch from "@/hooks/use-fetch";
import Image from "next/image";

// Predefined options
const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
const transmissions = ["Automatic", "Manual", "Semi-Automatic"];
const bodyTypes = [
  "SUV",
  "Sedan",
  "Hatchback",
  "Convertible",
  "Coupe",
  "Wagon",
  "Pickup",
];
const carStatuses = ["AVAILABLE", "UNAVAILABLE", "SOLD"];

// Define form schema with Zod
const carFormSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .string()
    .refine((val) => {
      const year = parseInt(val);
      return !isNaN(year) && year >= 1900 && year <= new Date().getFullYear() + 1;
    }, "Valid year required"),
  price: z.string().min(1, "Price is required"),
  mileage: z.string().min(1, "Mileage is required"),
  color: z.string().min(1, "Color is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  transmission: z.string().min(1, "Transmission is required"),
  bodyType: z.string().min(1, "Body type is required"),
  seats: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["AVAILABLE", "UNAVAILABLE", "SOLD"]),
  featured: z.boolean().default(false),
});

export const AddCarForm = () => {
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageError, setImageError] = useState("");

  // Initialize form with react-hook-form and zod
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      price: "",
      mileage: "",
      color: "",
      fuelType: "",
      transmission: "",
      bodyType: "",
      seats: "",
      description: "",
      status: "AVAILABLE",
      featured: false,
    },
  });

  // Custom hook for API call
  const { loading: addCarLoading, fn: addCarFn, data: addCarResult } = useFetch(addCar);

  // Handle successful car addition
  useEffect(() => {
    if (addCarResult?.success) {
      toast.success("Car added successfully");
      router.push("/admin/cars");
    }
  }, [addCarResult, router]);

  // Handle multiple image uploads with Dropzone (manual only)
  const onMultiImagesDrop = useCallback((acceptedFiles) => {
    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit and will be skipped`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);

        const newImages = [];
        validFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            newImages.push(e.target.result);
            if (newImages.length === validFiles.length) {
              setUploadedImages((prev) => [...prev, ...newImages]);
              setUploadProgress(0);
              setImageError("");
              toast.success(`Successfully uploaded ${validFiles.length} images`);
            }
          };
          reader.readAsDataURL(file);
        });
      }
    }, 200);
  }, []);

  const { getRootProps: getMultiImageRootProps, getInputProps: getMultiImageInputProps } = useDropzone({
    onDrop: onMultiImagesDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
  });

  // Remove image from upload preview
  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (uploadedImages.length === 0) {
      setImageError("Please upload at least one image");
      return;
    }

    const carData = {
      ...data,
      year: parseInt(data.year),
      price: parseFloat(data.price),
      mileage: parseInt(data.mileage),
      seats: data.seats ? parseInt(data.seats) : null,
    };

    await addCarFn({
      carData,
      images: uploadedImages,
    });
  };

  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Araç Detayları</CardTitle>
          <CardDescription>Eklemek istediğiniz aracın detaylarını girin.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Make */}
              <div className="space-y-2">
                <Label htmlFor="make">Marka</Label>
                <Input id="make" {...register("make")} placeholder="örn. Toyota" className={errors.make ? "border-red-500" : ""} />
                {errors.make && <p className="text-xs text-red-500">{errors.make.message}</p>}
              </div>

              {/* Model */}
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" {...register("model")} placeholder="örn. Camry" className={errors.model ? "border-red-500" : ""} />
                {errors.model && <p className="text-xs text-red-500">{errors.model.message}</p>}
              </div>

              {/* Year */}
              <div className="space-y-2">
                <Label htmlFor="year">Yıl</Label>
                <Input id="year" {...register("year")} placeholder="örn. 2022" className={errors.year ? "border-red-500" : ""} />
                {errors.year && <p className="text-xs text-red-500">{errors.year.message}</p>}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Fiyat (₺)</Label>
                <Input id="price" {...register("price")} placeholder="örn. 2500000" className={errors.price ? "border-red-500" : ""} />
                {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
              </div>

              {/* Mileage */}
              <div className="space-y-2">
                <Label htmlFor="mileage">Kilometre</Label>
                <Input id="mileage" {...register("mileage")} placeholder="örn. 15000" className={errors.mileage ? "border-red-500" : ""} />
                {errors.mileage && <p className="text-xs text-red-500">{errors.mileage.message}</p>}
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label htmlFor="color">Renk</Label>
                <Input id="color" {...register("color")} placeholder="örn. Mavi" className={errors.color ? "border-red-500" : ""} />
                {errors.color && <p className="text-xs text-red-500">{errors.color.message}</p>}
              </div>

              {/* Fuel Type */}
              <div className="space-y-2">
                <Label htmlFor="fuelType">Yakıt Türü</Label>
                <Select onValueChange={(value) => setValue("fuelType", value)} defaultValue={getValues("fuelType")}>
                  <SelectTrigger className={errors.fuelType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Yakıt türü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fuelType && <p className="text-xs text-red-500">{errors.fuelType.message}</p>}
              </div>

              {/* Transmission */}
              <div className="space-y-2">
                <Label htmlFor="transmission">Vites</Label>
                <Select onValueChange={(value) => setValue("transmission", value)} defaultValue={getValues("transmission")}>
                  <SelectTrigger className={errors.transmission ? "border-red-500" : ""}>
                    <SelectValue placeholder="Vites türü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {transmissions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.transmission && <p className="text-xs text-red-500">{errors.transmission.message}</p>}
              </div>

              {/* Body Type */}
              <div className="space-y-2">
                <Label htmlFor="bodyType">Kasa Tipi</Label>
                <Select onValueChange={(value) => setValue("bodyType", value)} defaultValue={getValues("bodyType")}>
                  <SelectTrigger className={errors.bodyType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Kasa tipi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {bodyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.bodyType && <p className="text-xs text-red-500">{errors.bodyType.message}</p>}
              </div>

              {/* Seats */}
              <div className="space-y-2">
                <Label htmlFor="seats">
                  Koltuk Sayısı <span className="text-sm text-gray-500">(Opsiyonel)</span>
                </Label>
                <Input id="seats" {...register("seats")} placeholder="örn. 5" />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Durum</Label>
                <Select onValueChange={(value) => setValue("status", value)} defaultValue={getValues("status")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Durum seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {carStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === "AVAILABLE" ? "Mevcut" : status === "UNAVAILABLE" ? "Mevcut Değil" : "Satıldı"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Aracın detaylı açıklamasını girin..."
                className={`min-h-32 ${errors.description ? "border-red-500" : ""}`}
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            {/* Featured */}
            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
              <Checkbox
                id="featured"
                checked={watch("featured")}
                onCheckedChange={(checked) => {
                  setValue("featured", checked);
                }}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="featured">Bu aracı öne çıkar</Label>
                <p className="text-sm text-gray-500">Öne çıkarılan araçlar ana sayfada görünür</p>
              </div>
            </div>

            {/* Image Upload with Dropzone */}
            <div>
              <Label htmlFor="images" className={imageError ? "text-red-500" : ""}>
                Resimler {imageError && <span className="text-red-500">*</span>}
              </Label>
              <div className="mt-2">
                <div
                  {...getMultiImageRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition ${
                    imageError ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <input {...getMultiImageInputProps()} />
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-3" />
                    <span className="text-sm text-gray-600">Birden fazla resim yüklemek için sürükleyip bırakın veya tıklayın</span>
                    <span className="text-xs text-gray-500 mt-1">(JPG, PNG, WebP, en fazla 5MB)</span>
                  </div>
                </div>
                {imageError && <p className="text-xs text-red-500 mt-1">{imageError}</p>}
                {uploadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                )}
              </div>

              {/* Image Previews */}
              {uploadedImages.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Yüklenen Resimler ({uploadedImages.length})</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <Image src={image} alt={`Araç resmi ${index + 1}`} height={50} width={50} className="h-28 w-full object-cover rounded-md" priority />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full md:w-auto" disabled={addCarLoading}>
              {addCarLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Araç Ekleniyor...
                </>
              ) : (
                "Araç Ekle"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};