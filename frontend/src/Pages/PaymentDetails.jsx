import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchGetPayment } from "@/features/PaymentSlice";

function PaymentDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const getPayment = useSelector((state) => state.payment.getPayment);
  const getPaymentStatus = useSelector(
    (state) => state.payment.getPaymentStatus
  );

  const paymentFor = getPayment?.payment_for || [];
  const payer = getPayment?.payer || "";
  const splitAmount = getPayment?.split_amount || "";
  const PaymentDetails = getPayment?.payment_details || "";

  useEffect(() => {
    dispatch(fetchGetPayment(id));
  }, [id]);
  return (
    <>
      {getPaymentStatus === "loading" || getPaymentStatus === "idle" ? (
        <p>Loading...</p>
      ) : getPaymentStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <h2 className="text-base md:text-2xl font-semibold">
                  {PaymentDetails.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {PaymentDetails.created_at
                    ? PaymentDetails.created_at.split("T")[0]
                    : ""}
                </p>
              </div>
              <div>
                <h2 className="text-base md:text-xl font-semibold">
                  Total Amount
                </h2>
                <p className="text-base md:text-xl text-center font-bold">
                  ₹{PaymentDetails.amount}
                </p>
              </div>
            </div>
            <p className="text-base md:text-xl font-semibold">
              Payer - {payer.name}
            </p>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col space-y-2 w-full">
              <h1 className="text-base md:text-xl font-semibold">
                How to liquidation
              </h1>
              {paymentFor.map((person) => (
                <div key={person.id} className="flex justify-between">
                  {person.name !== payer.name && (
                    <>
                      <p className="text-base md:text-xl">
                        {person.name} {"->"} {payer.name}
                      </p>
                      <p className="text-base md:text-xl">₹{splitAmount}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}

export default PaymentDetails;
