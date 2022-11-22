package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gopkg.in/olahol/melody.v1"
)

func main() {
	app := gin.Default()
	ws := melody.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	app.GET("/healthcheck", func(c *gin.Context) {
		c.JSON(200, "OK")
	})

	app.GET("/ws", func(c *gin.Context) {
		ws.HandleRequest(c.Writer, c.Request)
	})

	ws.HandleMessage(func(s *melody.Session, msg []byte) {
		ws.Broadcast(msg)
	})

	log.Fatal(app.Run(":4000"))
}
