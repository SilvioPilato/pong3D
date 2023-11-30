package main

import (
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type WsMessageType int64

var rooms = make(map[string][]*websocket.Conn)

const (
	JoinRequest WsMessageType = iota
)

func setupRoutes(r *mux.Router) {
	r.HandleFunc("/room", createRoom).Methods("POST")
	r.HandleFunc("/ws", wsRequest)
}

func createRoom(w http.ResponseWriter, _ *http.Request) {
	id := uuid.New().String()
	res := RoomCreate{RoomId: id}
	_, err := fmt.Fprintf(w, id)
	if err != nil {
		return
	}
}

type WSMessage struct {
	Message string        `json:"message"`
	Topic   WsMessageType `json:"topic"`
}

type RoomJoin struct {
	Room     string `json:"room"`
	Username string `json:"username"`
}

type RoomCreate struct {
	RoomId string `json:"id"`
}

func handleJoinRequest(join *RoomJoin, conn *websocket.Conn) {
	if rooms[join.Room] == nil {
		rooms[join.Room] = make([]*websocket.Conn, 0)
	}
	_ = append(rooms[join.Room], conn)
}

func handleWS(message *WSMessage, conn *websocket.Conn) error {
	var err error = nil
	switch topic := message.Topic; topic {

	case JoinRequest:
		jReq := &RoomJoin{}
		err = json.Unmarshal([]byte(message.Message), jReq)
		if err == nil {
			handleJoinRequest(jReq, conn)
		}
	}

	return err
}

func reader(conn *websocket.Conn) {
	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		wsmsg := &WSMessage{}
		err = json.Unmarshal(p, &WSMessage{})
		if err != nil {
			log.Println(err)
			return
		}
		err = handleWS(wsmsg, conn)
		if err != nil {
			log.Println(err)
			return
		}
	}
}

func wsRequest(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool {
		return true
	}
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}

	log.Println("Client connected...")

	reader(ws)
}

func main() {
	r := mux.NewRouter()
	setupRoutes(r)
	log.Fatal(http.ListenAndServe(":8000", r))
}
