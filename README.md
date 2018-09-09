# Leibnitz


**Leibnitz** is a simulator of 3D body trajectories with differential equation


Wiki at https://github.com/m-marini/leibnitz/wiki

## Editor workflow

```mermaid
graph LR;
ExternalInput(Ext Inp)
Parser(Parser)
UIPanel(Panel)
Output(Output)
Builder(Builer)

ExternalInput-- conf -->Parser
Parser--result/errors-->UIPanel
UIPanel--changes-->Builder
UIPanel--removeBtn-->RemoveEntryPanel
RemoveEntryPanel--remove entry-->UIPanel1
UIPanel--addBtn-->NewDefPanel
NewDefPanel-- add entry-->UIPanel1
UIPanel--system-->Output
UIPanel1-- changes -->Builder
Builder--conf-->Parser

```

## Developlment

To start reac dev environment run:
```
npm start
```
