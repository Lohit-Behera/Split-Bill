import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetGroup } from "@/features/GroupSlice";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchCreatePayment, resetPayment } from "@/features/PaymentSlice";
import Loader from "@/components/Loader/Loader";
import { toast } from "sonner";
import ServerError from "@/components/ServerError";

function PaymentPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getGroup = useSelector((state) => state.group.getGroup) || {};
  const persons = getGroup.persons || [];
  const getGroupStatus = useSelector((state) => state.group.getGroupStatus);
  const payment = useSelector((state) => state.payment.payment) || {};
  const paymentStatus = useSelector((state) => state.payment.paymentStatus);

  const [selectedPayer, setSelectedPayer] = useState("");
  const [paymentName, setPaymentName] = useState("");
  const [amount, setAmount] = useState(0);
  const [paymentFor, setPaymentFor] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (paymentStatus === "succeeded") {
      setSelectedPayer("");
      setPaymentName("");
      setAmount(0);
      setPaymentFor([]);
      dispatch(resetPayment());
      navigate(`/payment/details/${payment.id}`);
      setLoading(false);
    } else if (paymentStatus === "failed") {
      setLoading(false);
    }
  }, [paymentStatus]);

  useEffect(() => {
    dispatch(fetchGetGroup(id));
  }, [id]);

  useEffect(() => {
    if (persons.length > 0) {
      setPaymentFor(persons.map((person) => person.id));
    }
  }, [persons]);

  const handleCheckboxChange = (personId) => {
    setPaymentFor((prevState) =>
      prevState.includes(personId)
        ? prevState.filter((id) => id !== personId)
        : [...prevState, personId]
    );
  };

  const handleSave = () => {
    if (selectedPayer === "" || paymentName === "") {
      toast.warning("Please fill in all the fields");
    } else if (amount <= 0) {
      toast.warning("Amount must be greater than 0");
    } else if (paymentFor.length === 0) {
      toast.warning("Payment for cannot be empty");
    } else {
      setLoading(true);
      const createPromise = dispatch(
        fetchCreatePayment({
          id: id,
          payer: selectedPayer,
          name: paymentName,
          amount: amount,
          payment_for: paymentFor,
        })
      ).unwrap();
      toast.promise(createPromise, {
        loading: "Creating payment...",
        success: "Payment created successfully",
        error: "Something went wrong",
      });
    }
  };

  return (
    <>
      {getGroupStatus === "loading" || getGroupStatus === "idle" || loading ? (
        <Loader />
      ) : getGroupStatus === "failed" ? (
        <ServerError />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Payer</Label>
              <Select value={selectedPayer} onValueChange={setSelectedPayer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Payer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Payer</SelectLabel>
                    {persons.map((person, index) => (
                      <SelectItem key={index} value={person.id}>
                        {person.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="payment-name">Payment Name</Label>
              <Input
                id="payment-name"
                placeholder="Payment Name"
                value={paymentName}
                onChange={(e) => setPaymentName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Price</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Price"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="md:text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div className="grid gap-2">
              <Label>Payment For</Label>
              <div className="flex flex-wrap gap-4">
                {persons.map((person, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <Checkbox
                      disabled
                      id={person.name}
                      checked={paymentFor.includes(person.id)}
                      onCheckedChange={() => handleCheckboxChange(person.id)}
                    />
                    <label
                      htmlFor={person.name}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {person.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button className="w-full" onClick={handleSave} size="sm">
              Save
            </Button>
            <Button onClick={() => navigate(-1)} className="w-full" size="sm">
              Go Back
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
}

export default PaymentPage;
