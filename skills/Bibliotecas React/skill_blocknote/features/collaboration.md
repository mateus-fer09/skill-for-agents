# Colaboração em tempo real e comentários

BlockNote usa Yjs para colaboração. A configuração documentada combina:
- um `Y.Doc`;
- um provider Yjs responsável por transportar updates;
- um fragment onde os dados BlockNote ficam armazenados;
- informações do usuário (como nome/cor);
- opção de exibição de labels de cursor.

A documentação mostra `withCollaboration` como helper de configuração e cita providers/infra como Liveblocks, PartyKit, Y-Sweet, Hocuspocus, y-websocket, y-indexeddb, y-webrtc e outros.

## Comentários
A documentação possui seção específica de Comments, com threads e integração de UI/colaboração. Exemplos oficiais incluem comentários, sidebar de threads e sugestões experimentais.

Fontes:
- https://www.blocknotejs.org/docs/features/collaboration
- https://www.blocknotejs.org/docs/features/collaboration/comments
