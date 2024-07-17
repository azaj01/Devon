import {
    UserMessage,
    BotMessage,
    ToolResponseMessage,
    ThoughtMessage,
    SpinnerMessage,
    RateLimitWarning,
    ErrorMessage,
} from '@/panels/chat/components/messages/chat.message-variants'
import { NotebookPen } from 'lucide-react'
import type { Message } from '@/lib/types'
export interface ChatMessages {
    messages: Message[]
    spinning: boolean
    paused: boolean
}

const ChatMessages = ({ messages, spinning, paused }: ChatMessages) => {
    return (
        <div className="relative px-6 mt-6">
            {messages && messages.length ? (
                <>
                    {messages.map((message, index) => (
                        <DisplayedChatMessage
                            key={`${index}-${message.type}`}
                            index={index}
                            message={message}
                        />
                    ))}
                </>
            ) : null}
            {spinning && <SpinnerMessage paused={paused} />}
        </div>
    )
}

/**
ModelResponse
- Content: Response by the model (currently in the format <THOUGHT></THOUGHT><ACTION></ACTION>)
- Next: The action is parsed and the right tool is chosen or user response is requested

ToolResponse
- Content: Response from the tool
- Next: The model is called with the reponse as the observation

UserRequest
- Content: User input
- Next: The output is sent as ToolRequest

Interrupt
- Content: The interrupt message
- Next: ModelResponse, the model is interrupted

Stop
- Content: None
- Next: None

Task
- Content: The next task/object the agent has to complete
- Next: ModelResponse

 */

const DisplayedChatMessage = ({
    message,
    index,
}: {
    message: Message
    index: number
}) => {
    return (
        message.type && (
            <div className="mb-8">
                {message.type === 'agent' ? (
                    <BotMessage content={message.text}></BotMessage>
                ) : message.type === 'thought' ? (
                    <ThoughtMessage content={message.text}></ThoughtMessage>
                ) : message.type === 'command' ? (
                    <ChatTypeWrapper type="Command">
                        {message.text}
                    </ChatTypeWrapper>
                ) : message.type === 'rateLimit' ? (
                    <RateLimitWarning className="text-gray-400"></RateLimitWarning>
                ) : message.type === 'tool' ? (
                    <ToolResponseMessage
                        className="text-gray-400"
                        content={message.text}
                        index={index}
                    ></ToolResponseMessage>
                ) : message.type === 'user' ? (
                    <UserMessage>{message.text}</UserMessage>
                ) : message.type === 'error' ? (
                    <ErrorMessage className={index === 1 ? '' : 'ml-[49px]'} content={message.text}></ErrorMessage>
                ) : (
                    // <ChatTypeWrapper type="(Type not found)">
                    //     {message.content}
                    // </ChatTypeWrapper>
                    <></>
                )}
            </div>
        )
    )
}

const ChatTypeWrapper = ({
    type,
    children,
    className,
}: {
    type: string
    children: string | JSX.Element
    className?: string
}) => {
    let pref: JSX.Element = <></>
    // if (type === 'Task') {
    //     pref = (
    //         <span className="font-bold mr-2 flex gap-2 items-center not-italic">
    //             <NotebookPen size={16} />
    //             Task:
    //         </span>
    //     )
    // }
    return (
        <p className={className}>
            {pref}
            {children}
        </p>
    )
}

export default ChatMessages
