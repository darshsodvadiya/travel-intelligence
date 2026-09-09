import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import OQL "mo:caffeineai-oql";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import FloatValue "mo:caffeineai-oql/FloatValue";
import Nat "mo:core/Nat";
import Types "types/common";
import DestinationsLib "lib/destinations";
import DestinationsApi "mixins/destinations-api";
import ApiDocMixin "mixins/api-doc";

actor {
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);

  let destinations : [Types.Destination];

  include Expose({
    entities = [
      OQL.Entity.manual<Types.Destination>(
        "destination",
        func () = DestinationsLib.seedCatalog.values(),
        "Destination",
        "id",
      )
        .sample(DestinationsLib.seedCatalog[0])
        .payload("name", func d = d.name)
        .payload("country", func d = d.country)
        .payload("category", func d = switch (d.category) { case (#city) "city"; case (#beach) "beach"; case (#mountain) "mountain"; case (#country) "country"; case (#attraction) "attraction" })
        .payload("description", func d = d.description)
        .payload("imageUrl", func d = d.imageUrl)
        .payload("lat", func d = d.coordinates.lat)
        .payload("lng", func d = d.coordinates.lng)
        .payload("crowdLevel", func d = switch (d.crowdLevel) { case (#low) "low"; case (#medium) "medium"; case (#high) "high" })
        .payload("score", func d = d.score)
        .payload("weather", func d = d.scoreFactors.weather)
        .payload("crowd", func d = d.scoreFactors.crowd)
        .payload("cost", func d = d.scoreFactors.cost)
        .payload("traffic", func d = d.scoreFactors.traffic)
        .payload("activities", func d = d.scoreFactors.activities)
        .payload("bestMonths", func d = d.bestTimeToVisit.bestMonths.map(func m = m.toText()).values().join(", "))
        .payload("bestDays", func d = d.bestTimeToVisit.bestDays.values().join(", "))
        .payload("bestTimeReason", func d = d.bestTimeToVisit.reason)
        .payload("hotel", func d = d.budget.hotel)
        .payload("food", func d = d.budget.food)
        .payload("transport", func d = d.budget.transport)
        .payload("activitiesBudget", func d = d.budget.activities)
        .payload("total", func d = d.budget.total)
        .payload("alternatives", func d = d.alternatives.map(func a = a.toText()).values().join(", "))
        .public_()
        .build(),
    ];
  });

  include DestinationsApi(DestinationsLib.seedCatalog);
  include ApiDocMixin();
};
