// import 'package:flutter/material.dart';
// import 'package:socket_io_client/socket_io_client.dart' as IO;

// void main() {
//   runApp(MyApp());
// }

// class MyApp extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       title: 'Flutter Socket.io Chat',
//       theme: ThemeData(
//         primarySwatch: Colors.blue,
//       ),
//       home: ChatPage(),
//     );
//   }
// }

// class ChatPage extends StatefulWidget {
//   @override
//   _ChatPageState createState() => _ChatPageState();
// }

// class _ChatPageState extends State<ChatPage> {
//   IO.Socket? socket;
//   String roomId = 'room1'; // Test room ID
//   String userId = '66e6926336455070e72e4bcb'; // Test user ID
//   List<String> messages = [];

//   @override
//   void initState() {
//     super.initState();
//     connectToSocket();
//   }

//   void connectToSocket() {
//     print('Attempting to connect to the socket server...');

//     // Initialize the socket connection
//     socket = IO.io('http://192.168.0.101:3000', <String, dynamic>{
//       'transports': ['websocket'],
//       'autoConnect': false, // Avoid auto connection, connect manually
//     });

//     // Connect to the server
//     socket?.connect();

//     // Listen for connection
//     socket?.on('connect', (_) {
//       print('Connected to socket server');
//       joinRoom();
//     });

//     // Listen for any connection error
//     socket?.on('connect_error', (error) {
//       print('Connection error: $error');
//     });

//     // Handle error
//     socket?.on('error', (data) {
//       print('Error: $data');
//     });

//     // Listen for previous messages in the room
//     socket?.on('previousMessages', (data) {
//       print('Previous messages received: $data');
//       setState(() {
//         messages.addAll(List<String>.from(data.map((msg) => msg['content'])));
//       });
//     });

//     // Listen for new messages in the room
//     socket?.on('message', (data) {
//       print('New message received: $data');
//       setState(() {
//         messages.add(data['content']);
//       });
//     });

//     // Handle disconnect
//     socket?.on('disconnect', (_) {
//       print('Disconnected from socket server');
//     });

//     // Listen for a general connection error event
//     socket?.on('reconnect_failed', (_) {
//       print('Reconnect failed.');
//     });
//   }

//   void joinRoom() {
//     // Emit joinRoom event
//     socket?.emit('joinRoom', {
//       'roomId': roomId,
//       'userId': userId,
//     });
//   }

//   void sendMessage(String message) {
//     if (message.isNotEmpty) {
//       socket?.emit('message', {
//         'roomId': roomId,
//         'userId': userId,
//         'content': message,
//       });
//     }
//   }

//   @override
//   void dispose() {
//     socket?.dispose();
//     super.dispose();
//   }

//   @override
//   Widget build(BuildContext context) {
//     TextEditingController _controller = TextEditingController();

//     return Scaffold(
//       appBar: AppBar(
//         title: Text('Chat Room: $roomId'),
//       ),
//       body: Column(
//         children: <Widget>[
//           Expanded(
//             child: ListView.builder(
//               itemCount: messages.length,
//               itemBuilder: (context, index) {
//                 return ListTile(
//                   title: Text(messages[index]),
//                 );
//               },
//             ),
//           ),
//           Padding(
//             padding: const EdgeInsets.all(8.0),
//             child: Row(
//               children: <Widget>[
//                 Expanded(
//                   child: TextField(
//                     controller: _controller,
//                     decoration: InputDecoration(hintText: 'Enter message'),
//                   ),
//                 ),
//                 IconButton(
//                   icon: Icon(Icons.send),
//                   onPressed: () {
//                     sendMessage(_controller.text);
//                     _controller.clear();
//                   },
//                 ),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }
