package checkin

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"strings"
	"time"
	"github.com/google/uuid"
)
type Claims struct { MemberID uuid.UUID `json:"member_id"`; GymID uuid.UUID `json:"gym_id"`; ExpiresAt int64 `json:"exp"` }
func Sign(c Claims, secret []byte) (string,error) { b,err:=json.Marshal(c);if err!=nil{return "",err}; p:=base64.RawURLEncoding.EncodeToString(b); m:=hmac.New(sha256.New,secret);_,_=m.Write([]byte(p));return p+"."+base64.RawURLEncoding.EncodeToString(m.Sum(nil)),nil }
func Verify(token string, secret []byte, now time.Time)(Claims,error){parts:=strings.Split(token,".");if len(parts)!=2{return Claims{},errors.New("invalid token")};m:=hmac.New(sha256.New,secret);_,_=m.Write([]byte(parts[0]));sig,err:=base64.RawURLEncoding.DecodeString(parts[1]);if err!=nil||!hmac.Equal(sig,m.Sum(nil)){return Claims{},errors.New("invalid token")};b,err:=base64.RawURLEncoding.DecodeString(parts[0]);if err!=nil{return Claims{},err};var c Claims;if err=json.Unmarshal(b,&c);err!=nil{return Claims{},err};if c.MemberID==uuid.Nil||c.GymID==uuid.Nil||c.ExpiresAt < now.Unix()-5{return Claims{},errors.New("expired token")};return c,nil}
