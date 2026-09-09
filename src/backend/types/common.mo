module {
  public type Category = {
    #city;
    #beach;
    #mountain;
    #country;
    #attraction;
  };

  public type CrowdLevel = {
    #low;
    #medium;
    #high;
  };

  public type Coordinates = {
    lat : Float;
    lng : Float;
  };

  public type ScoreFactors = {
    weather : Nat;
    crowd : Nat;
    cost : Nat;
    traffic : Nat;
    activities : Nat;
  };

  public type BestTimeToVisit = {
    bestMonths : [Nat];
    bestDays : [Text];
    reason : Text;
  };

  public type BudgetEstimate = {
    hotel : Nat;
    food : Nat;
    transport : Nat;
    activities : Nat;
    total : Nat;
  };

  public type Destination = {
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
};
