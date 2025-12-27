import { useState } from "react";
import { MESSAGES, USERS, CLASSES, Role } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Send, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MessagesProps {
  role: Role;
}

export default function Messages({ role }: MessagesProps) {
  const currentUser = USERS[role];
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({ to: "", subject: "", content: "" });

  // Filter messages for current user
  const userMessages = MESSAGES.filter(
    m => m.to === currentUser.id || m.from === currentUser.id
  );

  // Group messages by thread
  const threads = userMessages.reduce((acc, msg) => {
    if (!acc[msg.threadId]) {
      acc[msg.threadId] = [];
    }
    acc[msg.threadId].push(msg);
    return acc;
  }, {} as Record<string, typeof MESSAGES>);

  const selectedMessages = selectedThread ? threads[selectedThread] : [];

  const handleSendReply = () => {
    if (!newMessage.trim() || !selectedThread) return;
    // In a real app, this would send to backend
    console.log("Sending reply:", newMessage);
    setNewMessage("");
  };

  const handleComposeMessage = () => {
    if (!composeData.to || !composeData.subject || !composeData.content) return;
    // In a real app, this would send to backend
    console.log("Sending new message:", composeData);
    setComposeData({ to: "", subject: "", content: "" });
    setIsComposing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="w-8 h-8" />
            Messages
          </h1>
          <p className="text-muted-foreground mt-1">
            {role === 'teacher'
              ? 'Communicate with your students'
              : 'View messages from your teachers'}
          </p>
        </div>
        <Dialog open={isComposing} onOpenChange={setIsComposing}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Compose New Message</DialogTitle>
              <DialogDescription>
                Send a message to {role === 'teacher' ? 'a student' : 'your teacher'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">To</label>
                <Input
                  placeholder={role === 'teacher' ? "Student name" : "Teacher name"}
                  value={composeData.to}
                  onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  placeholder="Message subject"
                  value={composeData.subject}
                  onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Type your message here..."
                  value={composeData.content}
                  onChange={(e) => setComposeData({ ...composeData, content: e.target.value })}
                  className="min-h-[120px]"
                />
              </div>
              <Button onClick={handleComposeMessage} className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Threads List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(threads).map(([threadId, messages]) => {
              const lastMessage = messages[messages.length - 1];
              const otherPerson = lastMessage.from === currentUser.id
                ? lastMessage.toName
                : lastMessage.fromName;
              const unread = messages.some(m => !m.read && m.to === currentUser.id);

              return (
                <button
                  key={threadId}
                  onClick={() => setSelectedThread(threadId)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedThread === threadId
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{otherPerson}</p>
                      <p className={`text-xs truncate ${
                        selectedThread === threadId
                          ? 'text-primary-foreground/80'
                          : 'text-muted-foreground'
                      }`}>
                        {lastMessage.subject}
                      </p>
                    </div>
                    {unread && (
                      <Badge
                        variant={selectedThread === threadId ? 'secondary' : 'default'}
                        className="h-5"
                      >
                        New
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
            {Object.keys(threads).length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No messages yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Thread View */}
        <Card className="lg:col-span-2">
          {selectedThread ? (
            <>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{selectedMessages[0]?.subject}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  with {selectedMessages[0]?.from === currentUser.id
                    ? selectedMessages[0]?.toName
                    : selectedMessages[0]?.fromName}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {selectedMessages.map((message) => {
                    const isFromMe = message.from === currentUser.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            isFromMe
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            isFromMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {message.date}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your reply..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button onClick={handleSendReply} className="shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Select a conversation to view messages</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
