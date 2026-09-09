import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type UserRole = {
    #admin;
    #user;
    #guest;
  };

  type AccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, UserRole>;
  };

  type Category = {
    #city;
    #beach;
    #mountain;
    #country;
    #attraction;
  };

  type CrowdLevel = {
    #low;
    #medium;
    #high;
  };

  type Coordinates = {
    lat : Float;
    lng : Float;
  };

  type ScoreFactors = {
    weather : Nat;
    crowd : Nat;
    cost : Nat;
    traffic : Nat;
    activities : Nat;
  };

  type BestTimeToVisit = {
    bestMonths : [Nat];
    bestDays : [Text];
    reason : Text;
  };

  type BudgetEstimate = {
    hotel : Nat;
    food : Nat;
    transport : Nat;
    activities : Nat;
    total : Nat;
  };

  type Destination = {
    id : Nat;
    name : Text;
    country : Text;
    category : Category;
    description : Text;
    imageUrl : Text;
    coordinates : Coordinates;
    crowdLevel : CrowdLevel;
    score : Nat;
    scoreFactors : ScoreFactors;
    bestTimeToVisit : BestTimeToVisit;
    budget : BudgetEstimate;
    alternatives : [Nat];
  };

  type OldActor = {};

  type NewActor = {
    accessControlState : AccessControlState;
    destinations : [Destination];
  };

  public func migration(_old : OldActor) : NewActor {
    {
      accessControlState = {
        var adminAssigned = false;
        userRoles = Map.empty();
      };
      destinations = [];
    };
  };
};
