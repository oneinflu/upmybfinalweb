import { useState } from 'react'
import { TopBar, type ViewMode, type TabMode } from '@/components/builder/TopBar'
import { ChatPanel } from '@/components/builder/ChatPanel'
import { PreviewPanel } from '@/components/builder/PreviewPanel'
import { PublishFlow } from '@/components/builder/PublishFlow'

interface Props {
  idea:         string
  projectName?: string
  onDashboard:  () => void
}

export function Builder({ idea, projectName = 'My Website', onDashboard }: Props) {
  const [viewMode,    setViewMode]    = useState<ViewMode>('desktop')
  const [tab,         setTab]         = useState<TabMode>('preview')
  const [publishOpen, setPublishOpen] = useState(false)

  return (
    <div style={{
      height: '100dvh', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', background: 'var(--canvas)',
    }}>
      <TopBar
        projectName={projectName}
        tab={tab}
        setTab={setTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onPublish={() => setPublishOpen(true)}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <ChatPanel idea={idea} projectName={projectName} />
        <PreviewPanel viewMode={viewMode} tab={tab} />
      </div>

      {publishOpen && (
        <PublishFlow
          onClose={() => setPublishOpen(false)}
          onDashboard={onDashboard}
        />
      )}
    </div>
  )
}
