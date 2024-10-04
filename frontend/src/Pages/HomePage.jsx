import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGroupDelete,
  fetchGroupList,
  resetDeleteGroup,
} from "@/features/GroupSlice";
import { Button } from "@/components/ui/button";
import { AlignJustify, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import CustomPagination from "@/components/CustomPagination";
import Loader from "@/components/Loader/Loader";
import ServerError from "@/components/ServerError";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let keyword = useLocation().search;

  const getGroupList = useSelector((state) => state.group.getGroupList) || [];
  const groupList = getGroupList?.group_list || [];
  const getGroupListStatus = useSelector(
    (state) => state.group.getGroupListStatus
  );
  const deleteGroupStatus = useSelector(
    (state) => state.group.deleteGroupStatus
  );

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchGroupList(keyword));
  }, [dispatch, keyword]);

  useEffect(() => {
    if (deleteGroupStatus === "succeeded") {
      dispatch(fetchGroupList());
      dispatch(resetDeleteGroup());
    } else if (deleteGroupStatus === "failed") {
      dispatch(resetDeleteGroup());
    }
  }, [deleteGroupStatus]);

  const handleDeleteGroup = (id) => {
    const deletePromise = dispatch(fetchGroupDelete(id)).unwrap();
    toast.promise(deletePromise, {
      loading: "Deleting group...",
      success: "Group deleted successfully",
      error: "Something went wrong",
    });
  };

  return (
    <>
      {getGroupListStatus === "loading" || getGroupListStatus === "idle" ? (
        <Loader className="min-h-[80vh]" />
      ) : getGroupListStatus === "failed" ? (
        <ServerError />
      ) : (
        <>
          <div className="flex justify-between my-4">
            <h1 className="text-base md:text-2xl font-bold ">Group List</h1>
            <Button variant="secondary" onClick={() => navigate(`/group`)}>
              Create Group
            </Button>
          </div>
          <div className="space-y-4">
            {groupList.map((group, index) => (
              <div
                key={index}
                className="flex justify-between bg-background border-2 p-2 rounded-lg"
              >
                <div className="flex flex-col w-[50%]">
                  <p className="md:text-xl font-semibold">{group.name}</p>
                  <div className="md:flex flex-wrap gap-2 hidden ">
                    {group.members.map((member, index) => (
                      <TooltipProvider key={index}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge className={"hover:cursor-pointer"}>
                              {member.name[0]}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{member.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
                <div className="hidden md:flex flex-col font-semibold">
                  <p className="text-right">Total Amount</p>
                  <p className="text-center">₹{group.total_amount}</p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/group/${group.id}`)}
                  >
                    <AlignJustify />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your group and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/70"
                          onClick={() => handleDeleteGroup(group.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
          <div className="my-4">
            <CustomPagination
              keyword="?page="
              pages={getGroupList.total_pages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              link="/"
            />
          </div>
        </>
      )}
    </>
  );
}

export default HomePage;
