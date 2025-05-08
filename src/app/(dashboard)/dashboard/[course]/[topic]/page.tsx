import CourseList from "@/components/platform/home/course/p";
import Navbar from "@/components/platform/navbar";
import React from "react";

function Page() {
  return (
    <div className="bg-bgWhiteGray">
      <Navbar />
      <CourseList />
    </div>
  );
}

export default Page;
