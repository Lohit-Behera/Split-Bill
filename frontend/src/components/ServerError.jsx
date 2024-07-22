import React from "react";
import { ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";

function ServerError() {
  return (
    <>
      <div className="flex w-[95%] min-h-[80vh] items-center justify-center p-5 rounded-lg mx-auto mt-4 border-2 bg-background/50">
        <div className="text-center">
          <div className="inline-flex rounded-full bg-red-100 p-6 shadow-lg shadow-red-500 ">
            <div className="rounded-full stroke-red-600 shadow-md shadow-red-500 bg-red-200 p-4">
              <ServerCrash size={84} color="#ef4444" />
            </div>
          </div>
          <h1 className="mt-5 text-3xl md:text-5xl font-bold">
            500 - Server error
          </h1>
          <p className="mt-5 lg:text-lg">
            Oops something went wrong. Try to refresh this page or <br /> feel
            free to contact us if the problem persists.
          </p>
          <Button className="mt-5" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      </div>
    </>
  );
}

export default ServerError;
