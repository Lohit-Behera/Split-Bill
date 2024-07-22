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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlignJustify,
  Trash,
  Pencil,
  Check,
  X,
  Plus,
  Minus,
} from "lucide-react";
import Loader from "@/components/Loader/Loader";
import LoaderSecondary from "@/components/Loader/LoaderSecondary";
import { toast } from "react-toastify";
import ServerError from "@/components/ServerError";

function calculateLiquidation(group, payment, payer) {
  if (
    !Array.isArray(group) ||
    !Array.isArray(payment) ||
    !Array.isArray(payer)
  ) {
    throw new Error("Invalid input: all arguments must be arrays");
  }
  if (group.length === 0 || payment.length === 0 || payer.length === 0) {
    throw new Error("Invalid input: arrays must not be empty");
  }
  if (payment.length !== payer.length) {
    throw new Error(
      "Invalid input: payment and payer arrays must have the same length"
    );
  }

  const numMembers = group.length;
  const totalPayment = payment.reduce((a, b) => a + b, 0);
  const sharePerMember = totalPayment / numMembers;

  let balances = {};
  group.forEach((member) => (balances[member] = -sharePerMember));

  for (let i = 0; i < payment.length; i++) {
    if (balances[payer[i]] === undefined) {
      throw new Error(`Payer ${payer[i]} is not in the group`);
    }
    balances[payer[i]] += payment[i];
  }

  let creditors = {};
  let debtors = {};

  for (let member in balances) {
    if (balances[member] > 0) {
      creditors[member] = balances[member];
    } else if (balances[member] < 0) {
      debtors[member] = -balances[member];
    }
  }

  let debtorMember = [];
  let creditorMember = [];
  let totalAmount = [];

  for (let debtor in debtors) {
    let debt = debtors[debtor];
    creditors = Object.fromEntries(
      Object.entries(creditors).sort((a, b) => b[1] - a[1])
    );

    while (debt > 0 && Object.keys(creditors).length > 0) {
      let [creditor, credit] = Object.entries(creditors)[0];
      if (credit > debt) {
        debtorMember.push(debtor);
        creditorMember.push(creditor);
        totalAmount.push(Math.round(debt));
        creditors[creditor] -= debt;
        if (creditors[creditor] === 0) {
          delete creditors[creditor];
        }
        debt = 0;
      } else {
        debtorMember.push(debtor);
        creditorMember.push(creditor);
        totalAmount.push(Math.round(credit));
        debt -= credit;
        delete creditors[creditor];
      }
    }
  }

  return {
    debtorMember: debtorMember,
    creditorMember: creditorMember,
    totalAmount: totalAmount,
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
  const payments = useSelector((state) => state.payment.paymentList) || [];
  const paymentListStatus = useSelector(
    (state) => state.payment.paymentListStatus
  );
  const deletePaymentStatus = useSelector(
    (state) => state.payment.deletePaymentStatus
  );
  const groupNameUpdateStatus = useSelector(
    (state) => state.group.groupNameUpdateStatus
  );

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(group.name);
  const [loading, setLoading] = useState(true);
  const [liquidationAmount, setLiquidationAmount] = useState(null);
  const [paymentList, setPaymentList] = useState([]);

  const creditorMember = liquidationAmount?.creditorMember || [];
  const debtorMember = liquidationAmount?.debtorMember || [];
  const totalAmount = liquidationAmount?.totalAmount || [];

  useEffect(() => {
    if (paymentListStatus === "succeeded") {
      setPaymentList([...paymentList].concat(payments.results));
    } else if (paymentListStatus === "failed") {
      setPaymentList([]);
    }
  }, [paymentListStatus]);

  useEffect(() => {
    if (paymentListStatus === "succeeded" && getGroupStatus === "succeeded") {
      const payer = payments.liquidation.map((p) => p.payer.name) || [];
      const member = person.map((p) => p.name) || [];
      const amount = payments.liquidation.map((p) => p.amount) || [];
      if (payer.length > 0 && member.length > 0 && amount.length > 0) {
        setLiquidationAmount(calculateLiquidation(member, amount, payer));
        setLoading(false);
      }
    }
  }, [paymentListStatus]);

  useEffect(() => {
    dispatch(fetchGetGroup(id));
    dispatch(fetchListPayment({ id: id, page: "" }));
    setEditName(group.name);
    setPaymentList([]);
    setLiquidationAmount(null);
  }, [dispatch, id]);

  useEffect(() => {
    if (deletePaymentStatus === "succeeded") {
      setPaymentList([]);
      dispatch(fetchListPayment({ id: id, page: "" }));
      dispatch(resetDeletePayment());
      toast.success("Payment deleted successfully");
    } else if (deletePaymentStatus === "failed") {
      dispatch(resetDeletePayment());
      toast.error("Payment deletion failed");
    }
  }, [deletePaymentStatus]);

  useEffect(() => {
    if (groupNameUpdateStatus === "succeeded") {
      setEditMode(false);
      dispatch(fetchGetGroup(id));
      setPaymentList([]);
      dispatch(fetchListPayment({ id: id, page: "" }));
      dispatch(resetGroupNameUpdate());
      toast.success("Group name updated successfully");
    } else if (groupNameUpdateStatus === "failed") {
      dispatch(resetGroupNameUpdate());
      toast.error("Group name update failed");
    }
  }, [groupNameUpdateStatus]);

  const handleUpdateName = () => {
    if (editName === "") {
      toast.warning("Name cannot be empty");
    } else {
      dispatch(fetchGroupNameUpdate({ id: id, name: editName }));
    }
  };

  const handleShowLess = () => {
    dispatch(fetchListPayment({ id: id, page: "" }));
    setPaymentList([]);
  };

  return (
    <>
      {getGroupStatus === "loading" || getGroupStatus === "idle" ? (
        <Loader className="min-h-[80vh]" />
      ) : getGroupStatus === "failed" ? (
        <ServerError />
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
              <div className="flex gap-2">
                {editMode ? (
                  <div className="flex flex-col gap-2 w-full">
                    <Input
                      id="name"
                      type="text"
                      value={editName || ""}
                      placeholder="Enter group new name"
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <div className="flex space-x-2 justify-end">
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
                        onClick={() => setEditMode(false)}
                      >
                        <X className="h-4 w-4 md:h-auto md:w-auto" />
                      </Button>
                    </div>
                  </div>
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
            <LoaderSecondary className="min-h-96" />
          ) : paymentListStatus === "failed" ? (
            <ServerError />
          ) : (
            <CardFooter>
              <div className="w-full">
                {paymentList.length === 0 ? (
                  <p className="flex justify-center text-base md:text-xl font-semibold">
                    No payments found
                  </p>
                ) : (
                  <>
                    <div className="flex flex-col w-full space-y-3">
                      <h2 className="text-base md:text-2xl font-bold text-center">
                        Payment List
                      </h2>
                      <Table>
                        <TableCaption>
                          {payments.total_pages === 1 ? (
                            <p>No more payments</p>
                          ) : payments.current_page === payments.total_pages ? (
                            <Button size="sm" onClick={handleShowLess}>
                              <Minus className="mr-2 h-4 w-4" /> Show Less
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() =>
                                dispatch(
                                  fetchListPayment({
                                    id: id,
                                    page: `?page=${payments.current_page + 1}`,
                                  })
                                )
                              }
                            >
                              <Plus className="mr-2 h-4 w-4" /> Load More
                            </Button>
                          )}
                        </TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50%]">Name</TableHead>
                            <TableHead className="text-center hidden sm:table-cell">
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
                              <TableCell className="text-center hidden sm:table-cell">
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
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                      <Trash className="h-4 w-4 md:h-auto md:w-auto" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you absolutely sure?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete your Payment and
                                        remove your data from our servers.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/70"
                                        onClick={() =>
                                          dispatch(fetchDeletePayment(p.id))
                                        }
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mb-6">
                      {loading ? (
                        <LoaderSecondary className="min-h-96" />
                      ) : (
                        <>
                          <h2 className="text-base md:text-2xl font-bold text-center my-4">
                            Liquidation
                          </h2>
                          <>
                            {creditorMember.map((person, index) => (
                              <div
                                key={index}
                                className="flex justify-between mx-8"
                              >
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
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </CardFooter>
          )}
        </Card>
      )}
    </>
  );
}

export default GroupDetails;
