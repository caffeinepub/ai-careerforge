import Text "mo:core/Text";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

actor {
  type Student = {
    name : Text;
    bio : Text;
    timeline : [Milestone];
    skills : [Text];
    projects : [Project];
    achievements : [Text];
    contactLinks : [ContactLink];
  };

  type Milestone = {
    title : Text;
    description : Text;
    date : Text;
  };

  type Project = {
    title : Text;
    description : Text;
    link : Text;
  };

  type ContactLink = {
    platform : Text;
    url : Text;
  };

  let students = Map.empty<Principal, Student>();

  public query ({ caller }) func getStudentRecordKey() : async Principal {
    caller;
  };

  public query ({ caller }) func getAllStudents() : async [(Principal, Student)] {
    students.toArray();
  };

  public query ({ caller }) func getStudent(id : Principal) : async ?Student {
    students.get(id);
  };
};
