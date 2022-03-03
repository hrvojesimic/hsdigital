export function prepare() {
  Blockly.Blocks['keep'] = {
      init: function() {
          this.appendValueInput("predicate").setCheck("Predicate").appendField("keep only");
          this.setPreviousStatement(true, "List");
          this.setNextStatement(true, null);
          this.setColour(200);
          this.setTooltip("Keeps only objects that fit the condition. All other objects are removed from the list.");
      }
  }
  Blockly.JavaScript['keep'] = function (block) {
      var predicate = Blockly.JavaScript.valueToCode(block, 'predicate', Blockly.JavaScript.ORDER_ATOMIC);
      if (predicate === '') predicate = "true";
      return `selection = selection.filter(x => ${predicate})\n`;
  }

  Blockly.Blocks['convert'] = {
      init() {
          this.appendValueInput("fn").appendField("convert to");
          this.setPreviousStatement(true, "List");
          this.setNextStatement(true, null);
          this.setColour(230);
          this.setTooltip("converts");
      }
  };
  Blockly.JavaScript['convert'] = function (block) {
      var fn = Blockly.JavaScript.valueToCode(block, 'fn', Blockly.JavaScript.ORDER_ATOMIC);
      if (fn === '') fn = "x";
      return `selection = selection.map(x => ${fn})\n`;
  };

  Blockly.Blocks.expect = {
      init() {
          this.appendValueInput("expr").setCheck("Boolean").appendField("expect");
          this.setPreviousStatement(true, "List");
          this.setColour(200);
          this.setTooltip("Expect shapes to match the condition on the right. This is the final block of the test.");
      }
  };
  Blockly.JavaScript.expect = function (block) {
      var rhs = Blockly.JavaScript.valueToCode(block, 'expr', Blockly.JavaScript.ORDER_ATOMIC);
      if (rhs === "") rhs = "null";
      return `out = ${rhs}\n`;
  };

  Blockly.Blocks['ofShape'] = {
      init() {
          this.appendDummyInput().appendField("shaped as")
              .appendField(new Blockly.FieldDropdown([
                  ["⭘", "Circle"], ["◻", "Square"], ["△", "EquilateralTriangle"]
              ]), "name")
          this.setOutput(true, "Predicate")
          this.setColour(150)
          this.setTooltip("Condition that the one object must be of specified shape. Fill is not taken into consideration.")
      }
  }
  Blockly.JavaScript['ofShape'] = function (block) {
      var name = block.getFieldValue('name');
      return ["x.shape === '" + name + "'", Blockly.JavaScript.ORDER_NONE];
  }

  Blockly.Blocks['isFilled'] = {
      init() {
          this.appendDummyInput().appendField("filled")
          this.setOutput(true, "Predicate");
          this.setColour(150);
          this.setTooltip("Checks to see if one object is filled.")
      }
  };
  Blockly.JavaScript['isFilled'] = function (block) {
      var name = block.getFieldValue('name');
      return ["x.filled", Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.Blocks.count = {
      init() {
          this.appendDummyInput().appendField("count")
              .appendField(new Blockly.FieldDropdown([["=", "=="], [">", ">"], ["<", "<"]]), "op")
              .appendField(new Blockly.FieldTextInput("0"), "compare");
          this.setOutput(true, "Boolean");
          this.setColour(230);
          this.setTooltip("Condition: Check the size of the collection.");
      }
  };
  Blockly.JavaScript.count = function (block) {
      var op = block.getFieldValue('op');
      var compare = block.getFieldValue('compare');
      return ["selection.length " + op + " " + compare, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.Blocks['every'] = {
      init() {
          this.appendValueInput("expr").setCheck("Predicate").appendField("every");
          this.setOutput(true, "Boolean");
          this.setColour(230);
          this.setTooltip("Condition is true only if condition on the right is true for EVERY object on the list.");
      }
  }
  Blockly.JavaScript['every'] = function (block) {
      var expr = Blockly.JavaScript.valueToCode(block, 'expr', Blockly.JavaScript.ORDER_ATOMIC)
      if (expr === "") expr = "true"
      return ["selection.every( x => " + expr + ")", Blockly.JavaScript.ORDER_NONE]
  }

  Blockly.Blocks['some'] = {
      init() {
          this.appendValueInput("expr").setCheck("Predicate").appendField("some")
          this.setOutput(true, "Boolean")
          this.setColour(230)
          this.setTooltip("Condition is true only if condition on the right is true for at least one object on the list.")
      }
  }
  Blockly.JavaScript['some'] = function (block) {
      var expr = Blockly.JavaScript.valueToCode(block, 'expr', Blockly.JavaScript.ORDER_ATOMIC);
      if (expr === "") expr = "false"
      return ["selection.some( x => " + expr + ")", Blockly.JavaScript.ORDER_NONE];
  }

  Blockly.Blocks['negate'] = {
      init() {
          this.appendValueInput("expr").setCheck(["Boolean", "Predicate"]).appendField("not")
          this.setOutput(true, ["Boolean", "Predicate"])
          this.setColour(270)
          this.setTooltip("Condition is true only if condition on the right is false, and vice versa.")
      }
  }
  Blockly.JavaScript['negate'] = function (block) {
      var expr = Blockly.JavaScript.valueToCode(block, 'expr', Blockly.JavaScript.ORDER_ATOMIC);
      if (expr === "") expr = "false"
      return ["!" + expr, Blockly.JavaScript.ORDER_NONE]
  }

  Blockly.Blocks['sortBy'] = {
      init() {
          this.appendDummyInput().appendField("sort by")
              .appendField(new Blockly.FieldDropdown([["area", "area"]]), "attr")
              .appendField(new Blockly.FieldDropdown([["ascending", "+"], ["descending", "-"]]), "dir")
          this.setPreviousStatement(true, "List")
          this.setNextStatement(true, "List")
          this.setColour(200)
          this.setTooltip("Orders the list by given attribute.")
      }
  }
  Blockly.JavaScript['sortBy'] = function (block) {
      var attr = block.getFieldValue('attr')
      var dir = block.getFieldValue('dir')
      return `sorting = true;selection = selection.sort((a,b) => ${dir}( a.${attr} - b.${attr} ))\n`
  }

  Blockly.Blocks['keepFirst'] = {
      init() {
          this.appendDummyInput().appendField("keep first")
              .appendField(new Blockly.FieldTextInput("1"), "n")
          this.setPreviousStatement(true, "List")
          this.setNextStatement(true, "List")
          this.setColour(200);
          this.setTooltip("Keeps only first n items in list.")
      }
  }
  Blockly.JavaScript['keepFirst'] = function (block) {
      var n = block.getFieldValue("n")
      return `selection = selection.slice(0, ${n})\n`
  }
}