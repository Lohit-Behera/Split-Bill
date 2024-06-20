import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGetPayment,
  fetchUpdatePayment,
  resetUpdatePayment,
} from "@/features/PaymentSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Pencil, X } from "lucide-react";
import Loader from "@/components/Loader/Loader";
import { toast } from "react-toastify";
import ServerError from "@/components/ServerError";

function PaymentDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getPayment = useSelector((state) => state.payment.getPayment);
  const getPaymentStatus = useSelector(
    (state) => state.payment.getPaymentStatus
  );

  const paymentFor = getPayment?.payment_for || [];
  const payer = getPayment?.payer || "";
  const splitAmount = getPayment?.split_amount || "";
  const PaymentDetails = getPayment?.payment_details || "";
  const updatePaymentStatus = useSelector(
    (state) => state.payment.updatePaymentStatus
  );

  const [editModeName, setEditModeName] = useState(false);
  const [editName, setEditName] = useState(PaymentDetails.name);
  const [editModeAmount, setEditModeAmount] = useState(false);
  const [editAmount, setEditAmount] = useState(PaymentDetails.amount);

  useEffect(() => {
    dispatch(fetchGetPayment(id));
  }, [id]);

  useEffect(() => {
    if (updatePaymentStatus === "succeeded") {
      dispatch(fetchGetPayment(id));
      dispatch(resetUpdatePayment());
      setEditModeName(false);
      setEditModeAmount(false);
      toast.success("Payment updated successfully");
    } else if (updatePaymentStatus === "failed") {
      toast.error("Payment update failed");
    }
  }, [updatePaymentStatus]);

  const handleUpdateName = () => {
    if (editName === "") {
      toast.warning("Name cannot be empty");
    } else {
      dispatch(fetchUpdatePayment({ id: id, amount: null, name: editName }));
    }
  };

  const handleUpdateAmount = () => {
    if (editAmount <= 0 || isNaN(editAmount)) {
      toast.warning("Amount must be greater than 0");
    } else {
      dispatch(fetchUpdatePayment({ id: id, name: null, amount: editAmount }));
    }
  };
  return (
    <>
      {getPaymentStatus === "loading" || getPaymentStatus === "idle" ? (
        <Loader />
      ) : getPaymentStatus === "failed" ? (
        <ServerError />
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <div className="flex gap-1 md:gap-4 justify-start w-[50%]">
                {editModeName ? (
                  <div className="flex flex-col items-start gap-1 md:gap-2 w-full">
                    <Input
                      id="name"
                      type="text"
                      value={editName || ""}
                      placeholder="Enter new payment name"
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-[90%]"
                    />
                    <div className="space-x-1 md:space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleUpdateName}
                      >
                        <Check className="h-4 w-4 md:h-auto md:w-auto" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditModeName(false)}
                      >
                        <X className="h-4 w-4 md:h-auto md:w-auto" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col">
                      <p className=" font-semibold">
                        Name : {PaymentDetails.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {PaymentDetails.created_at
                          ? PaymentDetails.created_at.split("T")[0]
                          : ""}
                      </p>
                    </div>
                    <span
                      onClick={() => setEditModeName(true)}
                      className="hover:cursor-pointer"
                    >
                      <Pencil size={22} className="mt-1.5" />
                    </span>
                  </>
                )}
              </div>
              <div className="flex gap-1 md:gap-4 justify-end w-[50%]">
                {editModeAmount ? (
                  <div className="flex flex-col items-end gap-1 md:gap-2 w-full">
                    <Input
                      id="name"
                      type="number"
                      value={editAmount || ""}
                      onChange={(e) => setEditAmount(e.target.value)}
                      placeholder="Enter new amount"
                      className="w-[90%] md:text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleUpdateAmount}
                      >
                        <Check className="h-4 w-4 md:h-auto md:w-auto" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditModeAmount(false)}
                      >
                        <X className="h-4 w-4 md:h-auto md:w-auto" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col">
                      <h2 className="font-semibold">Total Amount</h2>
                      <p className=" text-center font-bold">
                        ₹{PaymentDetails.amount}
                      </p>
                    </div>
                    <span
                      onClick={() => setEditModeAmount(true)}
                      className="hover:cursor-pointer"
                    >
                      <Pencil size={22} className="mt-1.5" />
                    </span>
                  </>
                )}
              </div>
            </div>
            <p className=" font-semibold">Payer - {payer.name}</p>
            <p className=" font-semibold">Group</p>
            <div className="flex flex-wrap gap-2 md:gap-4">
              {paymentFor.map((person) => (
                <TooltipProvider key={person.id}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge className={"hover:cursor-pointer"}>
                        {person.name}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{person.name[0] + person.name.slice(1)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2 w-full">
              <h1 className=" font-semibold">How to liquidation</h1>
              {paymentFor.map((person) => (
                <div key={person.id} className="flex justify-between">
                  {person.name !== payer.name && (
                    <>
                      <div className="flex space-x-2 w-[80%]">
                        <p className="">{person.name}</p>
                        <p className="">{"->"}</p>
                        <p className="">{payer.name}</p>
                      </div>
                      <p className=" w-[20%] text-right">₹{splitAmount}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between w-full">
              <Button size="sm" onClick={() => navigate(-1)}>
                Go Back
              </Button>
              <Button
                size="sm"
                onClick={() => navigate(`/group/${PaymentDetails.group}`)}
              >
                Group Details
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}

export default PaymentDetails;
