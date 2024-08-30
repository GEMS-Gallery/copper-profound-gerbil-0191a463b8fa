import Hash "mo:base/Hash";

import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Nat "mo:base/Nat";

actor WordCloud {
  // Stable variable to persist word frequencies across upgrades
  stable var wordFrequencyEntries : [(Text, Nat)] = [];

  // HashMap to store word frequencies
  var wordFrequency = HashMap.HashMap<Text, Nat>(0, Text.equal, Text.hash);

  // Initialize the HashMap with stable data
  public func init() : async () {
    wordFrequency := HashMap.fromIter<Text, Nat>(wordFrequencyEntries.vals(), 0, Text.equal, Text.hash);
  };

  // Add a word to the cloud or increment its frequency
  public func addWord(word : Text) : async () {
    let lowerWord = Text.toLowercase(word);
    switch (wordFrequency.get(lowerWord)) {
      case (null) { wordFrequency.put(lowerWord, 1); };
      case (?count) { wordFrequency.put(lowerWord, count + 1); };
    };
  };

  // Get the current state of the word cloud
  public query func getWordCloud() : async [(Text, Nat)] {
    Iter.toArray(wordFrequency.entries())
  };

  // System functions for upgrades
  system func preupgrade() {
    wordFrequencyEntries := Iter.toArray(wordFrequency.entries());
  };

  system func postupgrade() {
    wordFrequency := HashMap.fromIter<Text, Nat>(wordFrequencyEntries.vals(), 0, Text.equal, Text.hash);
    wordFrequencyEntries := [];
  };
}
