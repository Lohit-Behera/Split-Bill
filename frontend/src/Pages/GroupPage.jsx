import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroupCreate, resetGroup } from "@/features/GroupSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SquarePlus, X } from "lucide-react";
import { toast } from "react-toastify";

function GroupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const groupStatus = useSelector((state) => state.group.groupStatus);
  const group = useSelector((state) => state.group.group) || {};
  const groupDetails = group.group || {};

  const [name, setName] = useState("");
  const [members, setMembers] = useState([]);
  const [person, setPerson] = useState("");

  useEffect(() => {
    if (groupStatus === "succeeded") {
      setName("");
      setMembers([]);
      setPerson("");
      dispatch(resetGroup());
      navigate(`/group/${groupDetails.id}`);
      toast.success("Group created successfully");
    } else if (groupStatus === "failed") {
      toast.error("Group creation failed");
    }
  }, [groupStatus, group, navigate]);

  const handleMembers = () => {
    if (person === "") {
      toast.warning("Please enter a name");
    } else if (members.includes(person)) {
      toast.warning("Name already exists");
    } else {
      setMembers([...members, person]);
      setPerson("");
    }
  };

  const handleCreateGroup = () => {
    if (name === "") {
      toast.warning("Please enter a name");
    } else if (members.length < 2) {
      toast.warning("Please add members");
    } else {
      dispatch(
        fetchGroupCreate({
          name: name,
          members: members,
        })
      );
    }
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create Group
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              type="name"
              placeholder="Group Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="members">Members Names</Label>
            <div className="flex">
              <Input
                id="members"
                type="name"
                placeholder="Members Names"
                required
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleMembers();
                }}
                onChange={(e) => setPerson(e.target.value)}
                value={person}
                className="mr-2"
              />
              <Button variant="ghost" size="icon" onClick={handleMembers}>
                <SquarePlus />
              </Button>
            </div>
          </div>
          {members.length > 0 && (
            <>
              <p className="text-sm">Members:</p>
              <div className="flex flex-wrap gap-4">
                {members.map((member, index) => (
                  <div key={index}>
                    <p className=" flex bg-secondary p-2 rounded-lg">
                      {member}
                      <span
                        className="ml-2 mt-1.5 hover:cursor-pointer"
                        onClick={() =>
                          setMembers(members.filter((m) => m !== member))
                        }
                      >
                        <X size={15} />
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="default"
            className="w-full"
            onClick={handleCreateGroup}
          >
            Create
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default GroupPage;
