import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGroupDelete,
  fetchGroupList,
  resetDeleteGroup,
} from "@/features/GroupSlice";
import { Button } from "@/components/ui/button";
import { AlignJustify, Trash } from "lucide-react";
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

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getGroupList = useSelector((state) => state.group.getGroupList) || [];
  const deleteGroupStatus = useSelector(
    (state) => state.group.deleteGroupStatus
  );

  useEffect(() => {
    dispatch(fetchGroupList());
  }, [dispatch]);

  useEffect(() => {
    if (deleteGroupStatus === "succeeded") {
      alert("Group deleted successfully");
      dispatch(fetchGroupList());
      dispatch(resetDeleteGroup());
    } else if (deleteGroupStatus === "failed") {
      alert("Group deletion failed");
    }
  }, [deleteGroupStatus]);

  return (
    <>
      <div className="flex justify-between my-4">
        <h1 className="text-base md:text-2xl font-bold ">Group List</h1>
        <Button variant="secondary" onClick={() => navigate(`/group`)}>
          Create Group
        </Button>
      </div>
      <div className="space-y-4">
        {getGroupList.map((group, index) => (
          <div
            key={index}
            className="flex justify-between bg-card p-2 rounded-lg"
          >
            <p className="text-base md:text-xl font-bold">{group.name}</p>
            <div className="flex space-x-3">
              <Button
                variant="ghost"
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
                      This action cannot be undone. This will permanently delete
                      your group and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/70"
                      onClick={() => dispatch(fetchGroupDelete(group.id))}
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
    </>
  );
}

export default HomePage;
