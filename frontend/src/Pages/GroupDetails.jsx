import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGetGroup,
  resetGroupNameUpdate,
  fetchGroupNameUpdate,
} from "@/features/GroupSlice";
import {
  fetchListPayment,
  fetchDeletePayment,
  resetDeletePayment,
} from "@/features/PaymentSlice";
import calculateLiquidation from "@/features/CalculateLiquidation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlignJustify, Trash, Pencil, Check, X } from "lucide-react";

function GroupDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getGroup = useSelector((state) => state.group.getGroup) || {};
  const group = getGroup?.group || {};
  const person = getGroup?.persons || [];
  const getGroupStatus = useSelector((state) => state.group.getGroupStatus);
  const paymentList = useSelector((state) => state.payment.paymentList) || [];
  const paymentListStatus = useSelector(
    (state) => state.payment.paymentListStatus
  );
  const deletePaymentStatus = useSelector(
    (state) => state.payment.deletePaymentStatus
  );
  const groupNameUpdateStatus = useSelector(
    (state) => state.group.groupNameUpdateStatus
  );

  const payer = paymentList.map((p) => p.payer_name) || [];
  const member = person.map((p) => p.name) || [];
  const amount = paymentList.map((p) => p.amount) || [];

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(group.name);
  const [loading, setLoading] = useState(true);
  const [liquidationAmount, setLiquidationAmount] = useState(null);

  const creditorMember = liquidationAmount?.creditorMember || [];
  const debtorMember = liquidationAmount?.debtorMember || [];
  const totalAmount = liquidationAmount?.totalAmount || [];

  let liquidation = {};
  useEffect(() => {
    if (
      paymentListStatus === "succeeded" &&
      payer.length > 0 &&
      member.length > 0 &&
      amount.length > 0
    ) {
      setLiquidationAmount(calculateLiquidation(member, amount, payer));
      setLoading(false);
    }
  }, [paymentListStatus]);

  useEffect(() => {
    dispatch(fetchGetGroup(id));
    dispatch(fetchListPayment(id));
    setEditName(group.name);
  }, [dispatch, id]);

  useEffect(() => {
    if (deletePaymentStatus === "succeeded") {
      dispatch(fetchGetGroup(id));
      dispatch(fetchListPayment(id));
      dispatch(resetDeletePayment());
      alert("Payment deleted successfully");
    } else if (deletePaymentStatus === "failed") {
      dispatch(resetDeletePayment());
      alert("Payment deletion failed");
    }
  }, [deletePaymentStatus]);

  useEffect(() => {
    if (groupNameUpdateStatus === "succeeded") {
      setEditMode(false);
      dispatch(fetchGetGroup(id));
      dispatch(fetchListPayment(id));
      dispatch(resetGroupNameUpdate());
      alert("Group name updated successfully");
    } else if (groupNameUpdateStatus === "failed") {
      dispatch(resetGroupNameUpdate());
      alert("Group name update failed");
    }
  }, [groupNameUpdateStatus]);

  const handleUpdateName = () => {
    dispatch(fetchGroupNameUpdate({ id: id, name: editName }));
  };

  return (
    <>
      {getGroupStatus === "loading" || getGroupStatus === "idle" ? (
        <p>Loading...</p>
      ) : getGroupStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <p className="text-lg md:text-2xl font-bold ">Group Details</p>
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
              <div className="flex space-x-2  ">
                {editMode ? (
                  <>
                    <Input
                      id="name"
                      type="text"
                      value={editName || ""}
                      placeholder="Enter group new name"
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleUpdateName}
                    >
                      <Check />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditMode(false)}
                    >
                      <X className="h-4 w-4 md:h-auto md:w-auto" />
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-base md:text-xl font-semibold">
                      Name : {group.name}
                    </p>
                    <span
                      onClick={() => setEditMode(true)}
                      className="hover:cursor-pointer"
                    >
                      <Pencil
                        size={22}
                        className="h-4 w-4 md:h-auto md:w-auto mt-1 md:mt-1.5"
                      />
                    </span>
                  </>
                )}
              </div>
              <div className="flex flex-col">
                <p className="text-base md:text-xl font-semibold mb-4">
                  Members :
                </p>
                <div className="flex flex-wrap gap-3">
                  {person.map((p) => (
                    <Badge
                      key={p.id}
                      className="cursor-default hover:bg-primary md:text-sm"
                    >
                      {p.name}
                    </Badge>
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
                {paymentList.length === 0 ? (
                  <p>No payments found</p>
                ) : (
                  <div className="flex flex-col w-full space-y-3">
                    <h2 className="text-base md:text-2xl font-bold text-center">
                      Payment List
                    </h2>
                    <Table>
                      <TableCaption>
                        A list of your recent payment.
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50%]">Name</TableHead>
                          <TableHead className="text-right hidden sm:table-cell">
                            Payer Name
                          </TableHead>
                          <TableHead className="text-right hidden sm:table-cell">
                            Amount
                          </TableHead>
                          <TableHead className="text-right w-[10%]">
                            Details
                          </TableHead>
                          <TableHead className="text-right w-[10%]">
                            Delete
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentList.map((p, index) => (
                          <TableRow key={index}>
                            <TableCell className="md:text-base">
                              {p.name}
                            </TableCell>
                            <TableCell className="text-right hidden sm:table-cell">
                              {p.payer_name}
                            </TableCell>
                            <TableCell className="md:text-base text-right hidden sm:table-cell">
                              ₹{p.amount}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  navigate(`/payment/details/${p.id}`)
                                }
                              >
                                <AlignJustify className="h-4 w-4 md:h-auto md:w-auto" />
                              </Button>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  dispatch(fetchDeletePayment(p.id))
                                }
                              >
                                <Trash className="h-4 w-4 md:h-auto md:w-auto" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardFooter>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <h2 className="text-base md:text-2xl font-bold text-center my-4">
                    Liquidation
                  </h2>
                  {liquidation && (
                    <>
                      {creditorMember.map((person, index) => (
                        <div key={index} className="flex justify-between mx-8">
                          <>
                            <p className="text-base md:text-xl">
                              {debtorMember[index]} {"->"} {person}
                            </p>
                            <p className="text-base md:text-xl">
                              ₹{totalAmount[index]}
                            </p>
                          </>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </Card>
      )}
    </>
  );
}

export default GroupDetails;
