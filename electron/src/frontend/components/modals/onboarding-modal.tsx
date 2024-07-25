import { useState, Suspense, lazy, useEffect } from 'react'
import { CircleHelp, Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
import DisabledWrapper from '@/components/ui/disabled-wrapper'
import {
    SelectProjectDirectoryComponent,
    StartChatButton,
} from '@/components/modals/select-project-directory-modal'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { useSafeStorage } from '@/lib/services/safeStorageService'
import SafeStoragePopoverContent from '@/components/modals/safe-storage-popover-content'
import Combobox from '@/components/ui/combobox'
import { useModels } from '@/lib/models'

const Dialog = lazy(() =>
    import('@/components/ui/dialog').then(module => ({
        default: module.Dialog,
    }))
)
const DialogContent = lazy(() =>
    import('@/components/ui/dialog').then(module => ({
        default: module.DialogContent,
    }))
)

const DialogHeader = lazy(() =>
    import('@/components/ui/dialog').then(module => ({
        default: module.DialogHeader,
    }))
)
const DialogTitle = lazy(() =>
    import('@/components/ui/dialog').then(module => ({
        default: module.DialogTitle,
    }))
)

const OnboardingModal = ({
    setModelName,
    setOnboarded,
    afterOnboard,
}: {
    setModelName: (value: string) => void
    setOnboarded: (value: boolean) => void
    afterOnboard: (
        apiKey: string,
        modelName: string,
        folderPath: string
    ) => void
}) => {
    const [folderPath, setFolderPath] = useState('')
    const [apiKey, setApiKey] = useState('')

    const { addApiKey, getApiKey, setUseModelName } = useSafeStorage()
    const [isKeySaved, setIsKeySaved] = useState(false)
    const [hasClickedQuestion, setHasClickedQuestion] = useState(false)
    const { comboboxItems, selectedModel, setSelectedModel } = useModels()

    useEffect(() => {
        const fetchApiKey = async () => {
            if (!selectedModel) return
            const res = await getApiKey(selectedModel.value)
            // If it's already entered, don't let user edit
            if (res) {
                setApiKey(res)
                setIsKeySaved(true)
            } else {
                setApiKey('')
                setIsKeySaved(false)
            }
        }
        fetchApiKey()
    }, [selectedModel])

    const handleApiKeyInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setApiKey(e.target.value)
    }

    function afterSubmit() {
        if (!selectedModel) return
        const handleSaveApiKey = async () => {
            await addApiKey(selectedModel.value, apiKey, false)
            setIsKeySaved(true)
            await setUseModelName(selectedModel.value, false)
        }
        handleSaveApiKey() // Store the api key
        afterOnboard(apiKey, selectedModel.value, folderPath)
        setOnboarded(true) // Makes sure the other modal doesn't show up
        setModelName(selectedModel.value) // Closes the modal
    }

    function validateFields() {
        // if (!isChecked) return false
        return (apiKey !== '' || isKeySaved) && folderPath !== ''
    }

    return (
        <Suspense fallback={<></>}>
            <Dialog open={true}>
                <DialogContent
                    hideclose={true.toString()}
                    className="w-[500px]"
                >
                    <div className="flex flex-col items-center justify-center my-8 mx-8">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-bold">
                                Welcome to Devon!
                            </DialogTitle>
                        </DialogHeader>
                        <DisabledWrapper
                            disabled={false}
                            className="mt-10 w-full"
                        >
                            <SelectProjectDirectoryComponent
                                folderPath={folderPath}
                                setFolderPath={setFolderPath}
                            />
                        </DisabledWrapper>
                        <DisabledWrapper disabled={false} className="w-full">
                            <div className="flex flex-col mt-10 w-full">
                                <div className="flex flex-col mb-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-lg font-semibold">
                                            {`Choose your model:`}
                                        </p>
                                        {selectedModel && setSelectedModel && (
                                            <Combobox
                                                items={comboboxItems}
                                                itemType="model"
                                                selectedItem={selectedModel}
                                                setSelectedItem={
                                                    setSelectedModel
                                                }
                                            />
                                        )}
                                    </div>
                                    {selectedModel?.value !==
                                        'claude-3-5-sonnet' && (
                                        <span className="text-sm text-green-500 mt-2 flex gap-1 items-center">
                                            <Info className="w-4 h-4" />
                                            Note: For best results use Claude
                                            3.5 Sonnet (it's better at coding!)
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-1 items-center mb-4">
                                    <p className="text-lg font-bold">
                                        {`${selectedModel?.company} API Key`}
                                    </p>
                                    <Popover>
                                        <PopoverTrigger
                                            className="ml-[2px]"
                                            onClick={() =>
                                                setHasClickedQuestion(true)
                                            }
                                        >
                                            <CircleHelp size={14} />
                                        </PopoverTrigger>
                                        {isKeySaved ? (
                                            <PopoverContent
                                                side="top"
                                                className="bg-night w-fit p-2"
                                            >
                                                To edit, go to settings
                                            </PopoverContent>
                                        ) : (
                                            <SafeStoragePopoverContent />
                                        )}
                                    </Popover>
                                    {hasClickedQuestion && !apiKey && (
                                        <a
                                            className="text-primary hover:underline self-end ml-auto cursor-pointer"
                                            href={selectedModel?.apiKeyUrl}
                                            target="_blank"
                                        >
                                            Looking for an API key?
                                        </a>
                                    )}
                                </div>
                                <Input
                                    className="w-full"
                                    type="password"
                                    value={
                                        isKeySaved
                                            ? '******************************'
                                            : apiKey
                                    }
                                    onChange={handleApiKeyInputChange}
                                    disabled={isKeySaved}
                                />
                            </div>
                        </DisabledWrapper>
                        <StartChatButton
                            disabled={!validateFields()}
                            onClick={afterSubmit}
                            folderPath={folderPath}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </Suspense>
    )
}

export default OnboardingModal
