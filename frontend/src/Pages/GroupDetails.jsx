import React, { useEffect } from "react";
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
import { fetchListPayment } from "@/features/PaymentSlice";
import { Button } from "@/components/ui/button";
import { AlignJustify } from "lucide-react";

function calculateLiquidation(group, payment, payer) {
  const numMembers = group.length;
  const totalPayment = payment.reduce((acc, val) => acc + val, 0);
  const sharePerMember = totalPayment / numMembers;

  const balances = group.reduce((acc, member) => {
    acc[member] = -sharePerMember;
    return acc;
  }, {});

  payment.forEach((pay, index) => {
    balances[payer[index]] += pay;
  });

  let creditors = Object.entries(balances)
    .filter(([_, balance]) => balance > 0)
    .reduce((acc, [member, balance]) => {
      acc[member] = balance;
      return acc;
    }, {});

  const debtors = Object.entries(balances)
    .filter(([_, balance]) => balance < 0)
    .reduce((acc, [member, balance]) => {
      acc[member] = -balance;
      return acc;
    }, {});

  const debtorMember = [];
  const creditorMember = [];
  const debtAmount = [];
  const creditAmount = [];

  for (const [debtor, debt] of Object.entries(debtors)) {
    creditors = Object.entries(creditors)
      .sort((a, b) => b[1] - a[1])
      .reduce((acc, [member, balance]) => {
        acc[member] = balance;
        return acc;
      }, {});

    let remainingDebt = debt;
    while (remainingDebt > 0) {
      const [creditor, credit] = Object.entries(creditors)[0];
      if (credit > remainingDebt) {
        debtorMember.push(debtor);
        creditorMember.push(creditor);
        debtAmount.push(remainingDebt);
        creditors[creditor] -= remainingDebt;
        if (creditors[creditor] === 0) {
          delete creditors[creditor];
        }
        remainingDebt = 0;
      } else {
        debtorMember.push(debtor);
        creditorMember.push(creditor);
        creditAmount.push(credit);
        remainingDebt -= credit;
        delete creditors[creditor];
      }
    }
  }

  const totalAmount = debtAmount.concat(creditAmount);
  return {
    debtor_member: debtorMember,
    creditor_member: creditorMember,
    total_amount: totalAmount,
  };
}

function GroupDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getGroup = useSelector((state) => state.group.getGroup) || {};
  const group = getGroup?.group || {};
  const person = getGroup?.persons || [];
  const getGroupStatus = useSelector((state) => state.group.getGroupStatus);
  const paymentList = useSelector((state) => state.payment.paymentList) || [];
  const payments = paymentList?.payments || [];
  const payerList = paymentList?.payers || [];
  const paymentListStatus = useSelector(
    (state) => state.payment.paymentListStatus
  );

  const payer = payerList.map((p) => p.name);
  const member = person.map((p) => p.name);
  const amount = payments.map((p) => p.amount);

  const liquidation = calculateLiquidation(member, amount, payer);

  useEffect(() => {
    dispatch(fetchGetGroup(id));
    dispatch(fetchListPayment(id));
  }, [dispatch, id]);
  return (
    <>
      {getGroupStatus === "loading" || getGroupStatus === "idle" ? (
        <p>Loading...</p>
      ) : getGroupStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <p className="text-base md:text-2xl font-bold ">Group Details</p>
              <Button
                variant="secondary"
                onClick={() => navigate(`/payment/${id}`)}
              >
                Create Payment
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <p>Name : {group.name}</p>
              <div className="flex flex-col">
                <p className="mb-4">Members :</p>
                <div className="flex">
                  {person.map((p) => (
                    <p
                      key={p.id}
                      className="px-2 py-1 mx-2 bg-primary/70 rounded-lg"
                    >
                      {p.name}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          {paymentListStatus === "loading" || paymentListStatus === "idle" ? (
            <p>Loading...</p>
          ) : paymentListStatus === "failed" ? (
            <p>Error</p>
          ) : (
            <>
              <CardFooter>
                {payments.length === 0 ? (
                  <p>No payments found</p>
                ) : (
                  <div className="flex flex-col w-full space-y-3">
                    <h2 className="text-base md:text-2xl font-bold text-center">
                      Payment List
                    </h2>
                    {payments.map((p, index) => (
                      <div
                        key={index}
                        className="flex justify-between bg-background p-2 rounded-lg"
                      >
                        <p>Name: {p.name}</p>
                        <p>Amount: {p.amount}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/payment/details/${p.id}`)}
                        >
                          <AlignJustify />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardFooter>
              <CardFooter>
                <div className="flex flex-col space-y-2 w-full">
                  <h1 className="text-base md:text-xl font-semibold">
                    How to liquidation
                  </h1>
                  {liquidation.creditor_member.map((person, index) => (
                    <div key={index} className="flex justify-between">
                      <>
                        <p className="text-base md:text-xl">
                          {liquidation.debtor_member[index]} {"->"} {person}
                        </p>
                        <p className="text-base md:text-xl">
                          ₹{liquidation.total_amount[index]}
                        </p>
                      </>
                    </div>
                  ))}
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </>
  );
}

export default GroupDetails;
