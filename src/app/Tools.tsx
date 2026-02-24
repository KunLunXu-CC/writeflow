import { THEME } from '@/components/WriteFlow/types';
import { useWriteFlowContext } from '@/components/WriteFlowContext';
import { Drawer, DrawerContent, DrawerBody, Button, useDisclosure, Textarea } from '@heroui/react';
import { useCallback } from 'react';

export const Tools = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const writeFlow = useWriteFlowContext();

  const handleChange = useCallback(
    (value: string) => {
      if (writeFlow) {
        writeFlow.commands.initDocFromMarkdown({ markdownText: value });
      }
    },
    [writeFlow],
  );

  const handDarkTheme = useCallback(() => {
    if (writeFlow) {
      writeFlow.setTheme(THEME.DARK);
    }
  }, [writeFlow]);

  return (
    <>
      <Button
        isIconOnly
        color="danger"
        onPress={onOpen}
        aria-label="Like"
        className="fixed bottom-4 right-4">
        T
      </Button>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}>
        <DrawerContent>
          {() => (
            <DrawerBody>
              <Textarea
                minRows={10}
                label="Markdown Content"
                labelPlacement="outside"
                onValueChange={handleChange}
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onPress={handDarkTheme}>
                  暗色主题
                </Button>
              </div>
            </DrawerBody>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
