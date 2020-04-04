# Ontologies in learning

@:expr "_root_.hsimic.psbuk.md.Trig2Viz.fromPath(´/static/story/ontology-learning/http´)".

```trig2viz.owl
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix : <learn:> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
:LearningStrategy
  rdfs:label "learning strategy" .
:SpacedPractice a :LearningStrategy ;
  rdfs:label "spaced practice" .
:Interleaving a :LearningStrategy ;
  rdfs:label "interleaving" .
```

