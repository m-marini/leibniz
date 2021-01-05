The system consists of the expression definitions for:

- position of each body,
- optionally the rotation of each body general functions
- initial values ​​of the state variables
- value transitions of state variables

The compilation of the system of definitions takes place in the phases of:

1. (parsing) syntactic analysis of single expressions with creation of syntactic errors and syntactic trees for each definition
2. (status codeGen) semantic analysis of the functions and initial values ​​of the status variables with creation from the symbol table (key with type and executable code) and semantic errors (missing definitions, circular references, inconsistencies between operators and type of expressions),
3. (bodies codegen) semantic analysis of the state of bodies with creation of the symbol table for bodies and semantic errors (typology of functions not consistent with the position and rotation properties of bodies)
4. (transition codegen) semantic analysis of state transitions with the creation of the symbol table and semantic errors (types inconsistent with the initial state type)
5. (linking) linking of the various symbols and errors tables to generate the process of creating the initial state, the process of creating transitions and grouping errors by definition
