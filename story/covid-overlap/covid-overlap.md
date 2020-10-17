# Overlap cases with deaths

<div class="row">
  <div class="input_field col s6 m6">
    <select name="country" id="CountryList" onchange="reconstruct()">
    </select>
    <label for="countryList">Choose a country:</label>
  </div>
  <div class="input_field col s6 m6">
    <select name="w" id="AvgWindow" onchange="reconstruct()">
      <option value="1">daily</option>
      <option value="3">a week</option>
      <option value="7">two weeks</option>
      <option value="15">a month</option>
    </select>
    <label for="countryList">Average over:</label>
  </div>
</div>

<div id="Chart"></div>

