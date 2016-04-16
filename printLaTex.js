


easyAST = {
  
  type: "relational",
  leftOp: {
 
  type: "binaryOperator", 
  leftOp: {
    type: "binaryOperator",
    leftOp: {
      type: "trig",
      operator: "sin",
      argument: {
      type: "constant",
      value: "3"
    }
    },
    rightOp: {
      type: "constant",
      value: "5"
    },
    subType: "+"
  },
  rightOp: {
    type: "fraction",
    numerator: {
      type: "latin",
      name: "x"
    },
    denominator: {
       type: "constant",
       value: "8"
    }
  },
  subType: "+/-"
},
  rightOp: {
  type: "binaryOperator", 
  leftOp: { 
    type: "unaryOperator",
    subType: "sqrt",
    operand: { 
      type: "constant",
      value: "3"
    }},
   rightOp: {
     type: "constant",
      value: "9"
   },
   subType: "^"
  },
  subType: "congruent"
}


newAST = {
  type: "combinator",
  subType: "integral",
  contents: {
    type: "grouping",
    openingSymbol: "(",
    closingSymbol: ")",
    contents: {
      type: "constant",
      value: "8"
    }
  },
  variable: {
    type: "latin",
    name: "v",
  },
  maxLimit: {
    type: "latin",
    name: "2t",
  },
   minLimit: {
    type: "latin",
    name: "t",
  }
}



  



function printLaTeXExpr(AST) {
  switch(AST.type){
    case "constant":
      return printConstant(AST);
    case "binaryOperator":
      return printBinaryOperator(AST);
    case "latin":
      return printLatin(AST);
    case "fraction":
      return printFraction(AST);
    case "relational":
      return printRelational(AST);
    case "unaryOperator":
      return printUnaryOperator(AST);
    case "grouping":
      return printGrouping(AST);
    case "combinator":
      return printCombinator(AST);
    case "trig":
      return printTrig(AST);
  }
  return "";
 }


//
//Evaluates left, prints operator, evaluates right
function printBinaryOperator(AST) {
  var symbol = AST.subType
  switch(AST.subType){
    case "*":
    case "cross":
      symbol =  "\\times";
      break;
    case "dot":
      symbol = "\\cdot";
      break;
    case "+/-":
      symbol = "\\pm";
    case "-/+":
      symbol = "\\mp";
      break;
    case "%":
      symbol = "\\mod";
      break;
    case "nthroot":
      return "\\sqrt[" + printLaTeXExpr(AST.leftOp) + "]{" + printLaTeXExpr(AST.rightOp) + "}"; 
    case "implicitMultiply":
      printLaTeXExpr(AST.leftOp) + printLaTeXExpr(AST.rightOp);
    case "^":
      return printLaTeXExpr(AST.leftOp) + "^{" + printLaTeXExpr(AST.rightOp) + "}";
  }
  return "(" + printLaTeXExpr(AST.leftOp) + symbol + printLaTeXExpr(AST.rightOp) + ")";
}









//Just gives the value
function printConstant(AST) {
  return AST.value;
}


function printLatin(AST) {
  return AST.name;
}


function printFraction(AST) {
  return "\\frac{" + printLaTeXExpr(AST.numerator) + "}{" + printLaTeXExpr(AST.denominator) + "}";
}

function printRelational(AST){
  var symbol = AST.subType;
  switch(AST.subType){
    case "==":
      symbol = "=";
    case ">=":
      symbol = "\\geq";
      break;
    case "<=":
      symbol = "\\leq";
    case "!=":
      symbol = "\\neq";
    case "proportional":
      symbol = "\\propto";
    case "congruent":
      symbol = "\\equiv";
    case "approx":
      symbol = "\\approx";
  }
  return printLaTeXExpr(AST.leftOp) + symbol + printLaTeXExpr(AST.rightOp);
}


function printUnaryOperator(AST) {
  var preSymbol = "";
  var postSymbol = "";
  switch (AST.subType){
    case "not":
       preSymbol = "\\neg";
       break;
    case "-":
      preSymbol = "-";
    case "+/-":
       preSymbol = "\\pm";
       break;
    case "-/+":
       preSymbol = "\\mp";
       break;
    case "factorial":
      postSymbol = "!";
      break;
    case "sqrt":
      return "\\sqrt{" + printLaTeXExpr(AST.operand) + "}" ;
  }
  return preSymbol + printLaTeXExpr(AST.operand) + postSymbol;
}


function printGrouping(AST){
  return AST.openingSymbol + printLaTeXExpr(AST.contents) + AST.closingSymbol;
}


function printCombinator(AST){
  var symbol;
  var minLimit = "";
  var maxLimit = "";
  var variable = ""
  if (AST.minLimit != null) {
    minLimit = printLaTeXExpr(AST.minLimit);
  }
  if (AST.maxLimit != null) {
    maxLimit = printLaTeXExpr(AST.maxLimit);
  }
  if (AST.variable != null) {
    variable = printLaTeXExpr(AST.variable);
  }
  var contents = printLaTeXExpr(AST.contents);
  switch(AST.subType){
    case "integral":
      symbol = "\\int";
      contents = contents + " d" + printLaTeXExpr(AST.variable); 
      break;
    case "sum":
      symbol = "\\sum";
      break;
    case "product":
      symbol = "\\prod";
      break; 
    case "limsup":
      symbol = "\\limsup";
      minLimit = printLaTeXExpr(variable) + " \\to " + minLimit;
      break;
    case "lim":
      symbol = "\\lim";
      minLimit = printLaTeXExpr(variable) + " \\to " + minLimit;
      break;
    case "liminf":
      symbol = "\\liminf";
      minLimit = printLaTeXExpr(variable) + " \\to " + minLimit;
      break;
    case "union":
      symbol = "\\cup"
      break;
    case "intersect":
      symbol = "\\cap"
      break;
  }
  return symbol + "_{" + minLimit + "}^{" + maxLimit + "}" + contents;
}


function printTrig(AST) {
  return "\\" + AST.operator + "{(" + printLaTeXExpr(AST.argument) + ")}";
}



printLaTeXExpr(newAST);