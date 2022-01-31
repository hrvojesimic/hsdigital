# Yes, No, Don't know


There were three possible answers:

- _True_
- _False_
- _Don't know_

Eurobarometer report either to be the correct answer, which makes the other one incorrect. So for each group of answers we have three non-negative integers in the dataset:

- ⟨c⟩ ⋯ number of correct answers
- ⟨i⟩ ⋯ number of incorrect answers
- ⟨d⟩ ⋯ number of "don't know" (DK) answers

Total number of answers is a positive integer ⟨t = c + i + d⟩.

## The triangle chart

We are interested mostly in relative numbers, share of correct and incorrect answers: ⟨c/t⟩ and ⟨i/t⟩. Since ⟨c/t + i/t <= 1⟩, all possible outcomes can be plotted as a point in a triangle. For example, 50% correct answers, 30% incorrect ones and 20% don't-knows can be depicted like this:

<div class="tchart" data-palette="blues" data-formula="dot">
</div>

Different parts of the triangle have different combinations of ⟨c/t⟩, ⟨i/t⟩ and ⟨d/t⟩ in each point. I'm using here the RGB color model to represent the combination of these three numbers: the green component for correct answers, the red one for incorrect, and the blue for DKs:

<div class="tchart" data-palette="rgb" data-formula="pst">
</div>

How correct is a group of respondants

Here's a real-world example of the chart.

<div id="TriangleQ5" class="tchart" data-palette="rgb" data-formula="Q5">
</div>

## A single score

Eurobarometer is using a single number to sort , ⟨c/t⟩. In the basic numbers of our group, we can define this "correctness" score ⟨s_c⟩ as:

<p class="center-align">⟨ s_c = c/(c + i + d) ⟩</p>

We can plot this function using our ranging from dark red for zero, going through light yellow for 0.5 and finishing with dark green for the score value of one.

<div class="tchart" data-palette="redgreen" data-formula="sc">
</div>

We can see that the score varies only in the ⟨x⟩ dimension, and the ratio ⟨i : d⟩ makes no difference to the score. This means that respondents who abstained from answering were just as wrong as those convinced that the correct answer was the wrong one.


## Three scoring strategies

When calculating the score, we need to decide what to do with the DKs. There are three different strategies on what to make of them:

1. DKs are _wrong_
2. DKs are to be _excluded_ from calculation
3. DKs are _half-right_

We just saw the first strategy in action, ⟨s_c⟩. 

The principal problem with ⟨s_c⟩ is that it is sensitive to risk-taking respondents. 


## Excluding the "Don't know"s

Second strategy is to ignore the DKs in our calculations. Now the score is just the share of the correct in all "knowing" answers:

<p class="center-align">
⟨ s_r = c/(c + i) ⟩
</p>

But there is a small problem with this equation, as the score is undefined when all answers are DK, i.e. when ⟨c = i = 0⟩. So we need to explicitly define the value for that singularity. Not that the points along the ⟨y⟩-axis have value of 0, and those along the ⟨x⟩-axis have the value of 1. It makes sense to use the arhythmetic mean of these values, and also the value of all points along the main diagonal: 0.5. So we arrive at this definition for ⟨s_r⟩:

<p class="center-align">
⟨ s_r = {(c/(c + i), if c+i > 0), (0.5, if c+i = 0):} ⟩
</p>

<div class="tchart" data-palette="redgreen" data-formula="sr">
</div>

## The half-right model

We know ⟨c⟩ were correct, and another ⟨d/2⟩ would be correct if they tossed a coin instead of saying they don't know.

<p class="center-align">
⟨ s_M = (c + d/2)/(c + i + d) ⟩
</p}>


## The KDG model


- ⟨k⟩ ⋯ people **k**new the correct answer and answered that way
- ⟨d⟩ ⋯ people **d**idn't know the correct answer and said so
- ⟨g⟩ ⋯ people didn't know the correct answer, but ventured an unbiased **g**uess

Only incorrect answers in this model are the unlucky half of guessers: ⟨i = g/2⟩, so number of guessers is ⟨2i⟩, while the number of people who knew was ⟨k = c - g/2 = c - i⟩.

<p class="center-align">
⟨ s_M = k/(k + g + d) = (c - i)/(c + i + d) ⟩
</p>

In this model there are at least as many correct answers as incorrect ones (⟨c >= i⟩), which keeps ⟨s_M⟩ values between zero and one. However, when number of incorrect answers exceeds the correct ones, the score goes down all the way to -1. To get it back to the ⟨[0;1]⟩ range, we have to add one and then divide by two:

<p class="center-align">
⟨ (s_M + 1)/2 = ((c - i)/(c + i + d) + 1)/2 = ((c - i) + (c + i + d))/(2(c + i + d)) = (2c + d)/(2(c + i + d)) = (c + d/2)/(c + i + d) ⟩
</p>

But this is the half-right formula!

## The KMDG model

- ⟨k⟩ ⋯ **k**new the correct answer and answered that way
- ⟨m⟩ ⋯ thought they knew the correct answer, but were **m**istaken
- ⟨d⟩ ⋯ **d**idn't know the correct answer and said so
- ⟨g⟩ ⋯ didn't know the correct answer, but ventured an unbiased **g**uess

Count them: _four_ different variables

<p class="center-align">
⟨ i = m + g/2 ⇒ g = 2(i - m) ⟩<br>
⟨ c = k + g/2 ⇒ c - k = i - m ⇒ k = c - i + m ⟩<br>
⟨ s = k/(k + m + d) = (c - i + m)/(c - i + 2m + d) ⟩
</p>

In this model, 

<div class="tchart" data-palette="redgreen" data-formula="sm">
</div>


⟨A⟩ knew and picked the correct option. ⟨B⟩ didn't know, so they had 50% chance of guessing the correct option. So the correct answer gave ⟨c = A + B/2⟩ responders, while the incorrect were ⟨i = B/2⟩. Solving this for ⟨A⟩ and ⟨B⟩ gives us ⟨A = c - i⟩ and ⟨B = 2i⟩.

So the score is:

<p class="center-align">
⟨ s_m = A/(A+B) = (c - i)/(c + i + d) ⟩
</p>

<table class="highlight centered">
  <thead>
    <tr>
      <th>test case</th>
      <th>⟨s_c⟩</th>
      <th>⟨s_d⟩</th>
      <th>⟨s_m⟩</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>all gamblers</td>
      <td>50%</td>
      <td>50%</td>
      <td>50%</td>
    </tr>
    <tr>
      <td>all abstained</td>
      <td>0%</td>
      <td>50%</td>
      <td>50%</td>
    </tr>
    <tr>
      <td>quarters</td>
      <td>37.5%</td>
      <td>50%</td>
      <td>50%</td>
    </tr>
  </tbody>
</table>
