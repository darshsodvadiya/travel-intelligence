import Types "../types/common";
import DestinationsLib "../lib/destinations";

mixin (destinations : [Types.Destination]) {
  public query func listDestinations() : async [Types.Destination] {
    DestinationsLib.listDestinations(destinations)
  };

  public query func getDestination(id : Nat) : async ?Types.Destination {
    DestinationsLib.getDestination(destinations, id)
  };

  public query func searchDestinations(searchTerm : Text, category : ?Types.Category) : async [Types.Destination] {
    DestinationsLib.searchDestinations(destinations, searchTerm, category)
  };
};
