'use client';

import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    DragStartEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import ComplianceColumn from './ComplianceColumn';
import ComplianceCard from './ComplianceCard';
import ComplianceDetailsModal from './ComplianceDetailsModal';
import type { GeneratedContent } from '@/types/project';

interface ComplianceItem {
    projectId: string;
    projectName: string;
    content: GeneratedContent;
}

interface ComplianceBoardProps {
    items: ComplianceItem[];
    onStatusChange: (projectId: string, contentId: string, newStatus: GeneratedContent['complianceStatus']) => void;
    onUpdateContent?: (projectId: string, contentId: string, updates: { title?: string; assignee?: string }) => void;
    isFundBuzz?: boolean;
}

export default function ComplianceBoard({ items, onStatusChange, onUpdateContent, isFundBuzz }: ComplianceBoardProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<ComplianceItem | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const columns = ['Draft', 'Pending Review', 'Approved'];

    const getItemsByStatus = (status: string) => {
        return items.filter(item => (item.content.complianceStatus || 'Draft') === status);
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            // The over.id is the column ID (Draft, Review, Approved)
            const newStatus = over.id as GeneratedContent['complianceStatus'];
            const activeData = active.data.current;

            if (activeData) {
                onStatusChange(activeData.projectId, activeData.contentId, newStatus);
            }
        }

        setActiveId(null);
    };

    const activeItem = activeId ? items.find(item => `${item.projectId}-${item.content.id}` === activeId) : null;

    return (
        <>
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex h-[calc(100vh-200px)] gap-6 overflow-x-auto pb-4">
                    {columns.map((status) => (
                        <div key={status} className="flex-1 min-w-[300px]">
                            <ComplianceColumn
                                id={status}
                                title={status}
                                items={getItemsByStatus(status)}
                                isFundBuzz={isFundBuzz}
                                onCardClick={(item) => setSelectedItem(item)}
                            />
                        </div>
                    ))}
                </div>

                <DragOverlay>
                    {activeItem ? (
                        <div className="opacity-80 rotate-2 cursor-grabbing">
                            <ComplianceCard
                                id={`${activeItem.projectId}-${activeItem.content.id}`}
                                projectId={activeItem.projectId}
                                projectName={activeItem.projectName}
                                item={activeItem.content}
                                isFundBuzz={isFundBuzz}
                                onClick={() => { }}
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            <ComplianceDetailsModal
                item={selectedItem}
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                onStatusChange={(newStatus) => {
                    if (selectedItem) {
                        onStatusChange(selectedItem.projectId, selectedItem.content.id, newStatus);
                        // Optimistically update local state for the modal
                        setSelectedItem({
                            ...selectedItem,
                            content: { ...selectedItem.content, complianceStatus: newStatus }
                        });
                    }
                }}
                onUpdateContent={(updates) => {
                    if (selectedItem && onUpdateContent) {
                        onUpdateContent(selectedItem.projectId, selectedItem.content.id, updates);
                        // Optimistically update local state for the modal
                        setSelectedItem({
                            ...selectedItem,
                            content: {
                                ...selectedItem.content,
                                title: updates.title ?? selectedItem.content.title,
                                assignee: updates.assignee ?? selectedItem.content.assignee
                            }
                        });
                    }
                }}
                isFundBuzz={isFundBuzz}
            />
        </>
    );
}
