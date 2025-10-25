"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { chatWithResearchField } from "@/ai/flows/chat-with-research-field";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! What would you like to know about the current state of research?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
        const result = await chatWithResearchField({ query: currentInput });
        const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: result.answer,
            sender: 'bot'
        };
        setMessages(prev => [...prev, botResponse]);
    } catch (error) {
        console.error("Failed to get response from AI", error);
        const errorResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: "Sorry, I'm having trouble connecting to my knowledge base. Please try again.",
            sender: 'bot'
        };
        setMessages(prev => [...prev, errorResponse]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline">Conversational Assistant</h1>
        <p className="text-muted-foreground mt-1">
          Ask questions and get summarized, up-to-date answers about any research field.
        </p>
      </div>
      
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex-row items-center gap-3">
           <Sparkles className="w-6 h-6 text-primary"/>
           <div>
            <CardTitle className="font-headline">Chat with a Research Field</CardTitle>
            <CardDescription>Powered by AI</CardDescription>
           </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3",
                    message.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.sender === "bot" && (
                    <Avatar className="h-9 w-9 border">
                       <AvatarFallback className="bg-primary text-primary-foreground">
                         <Sparkles className="w-5 h-5"/>
                       </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-md rounded-lg px-4 py-3 text-sm",
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    )}
                  >
                    {message.text}
                  </div>
                  {message.sender === "user" && (
                     <Avatar className="h-9 w-9 border">
                        <AvatarImage src="https://picsum.photos/seed/user-avatar/40/40" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-9 w-9 border">
                       <AvatarFallback className="bg-primary text-primary-foreground">
                         <Sparkles className="w-5 h-5"/>
                       </AvatarFallback>
                    </Avatar>
                     <div className="max-w-md rounded-lg px-4 py-3 text-sm bg-secondary flex items-center">
                        <Loader2 className="w-4 h-4 animate-spin"/>
                     </div>
                 </div>
              )}
            </div>
          </ScrollArea>
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., 'What are the latest findings in quantum computing?'"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
