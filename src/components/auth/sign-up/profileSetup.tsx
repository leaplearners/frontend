"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info, PlusCircle, X } from "lucide-react";
import { AccountCreationProps } from "./accountCreation";

export interface ChildProfile {
  avatar: File | null;
  name: string;
  year: string;
  status: string;
}

function ProfileSetup({ currentStep, setCurrentStep }: AccountCreationProps) {
  const [data, setData] = useState<ChildProfile>({
    avatar: null,
    name: "",
    year: "",
    status: "active",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setData((d) => ({ ...d, avatar: e.target.files![0] }));
    }
  };

  const handleNext = () => {
    // you could validate here
    setCurrentStep(2);
  };

  // build year options from this year down to (this year - 18)
  const years = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <>
      <h5 className="text-textSubtitle font-medium uppercase text-sm md:text-base">
        step {currentStep + 1} out of 3
      </h5>
      <h2 className="font-semibold text-primaryBlue text-xl md:text-2xl lg:text-4xl my-3 text-center uppercase">
        YOUR CHILD&apos;S PROFILE SET UP
      </h2>
      <p className="text-textSubtitle font-medium mb-6 text-center">
        We are almost there
      </p>

      <div className="w-full max-w-xl">
        {/* Avatar picker */}
        <div className="flex justify-center mb-4">
          <label
            htmlFor="avatar-upload"
            className="relative cursor-pointer rounded-2xl bg-[#E9E9E9] p-0 flex flex-col items-center justify-center avatar-dashed"
            style={{ width: 222, height: 191 }}
          >
            {data.avatar ? (
              <div className="relative w-full h-full">
                <img
                  src={URL.createObjectURL(data.avatar)}
                  alt="Avatar preview"
                  className="object-cover rounded-lg w-full h-full"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setData((d) => ({ ...d, avatar: null }));
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ) : (
              <>
                <PlusCircle className="text-[#6B7280]" />
                <div className="text-sm text-[#6B7280] mt-2">Choose Avatar</div>
              </>
            )}
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatar}
            />
          </label>
        </div>

        {/* Name field */}
        <div className="space-y-2">
          <div className="flex flex-col gap-1.5">
            <label className="font-medium">Name</label>
            <Input
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Child’s name"
              className="!rounded-xl !h-11"
            />
          </div>

          {/* Year selector */}
          <div className="flex flex-col gap-1.5">
            <label className="font-medium">Year</label>
            <select
              name="year"
              value={data.year}
              onChange={handleChange}
              className="h-11 rounded-xl bg-transparent border border-[#D1D5DB] px-4 text-base "
            >
              <option value="" disabled>
                Year
              </option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Info banner */}
        <div className="mt-4 flex items-center justify-center gap-2 bg-[#E5EDFF] p-3 rounded-lg">
          <Info className="text-[#286CFF] w-4" />
          <p className="text-[#286CFF] text-sm font-medium">
            You can add more children after you are done with this current set
            up
          </p>
        </div>

        {/* Next button */}
        <div className="mt-8">
          <Button
            type="button"
            onClick={handleNext}
            variant="outline"
            className="w-full py-5 rounded-[999px] bg-primaryBlue text-white"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

export default ProfileSetup;
