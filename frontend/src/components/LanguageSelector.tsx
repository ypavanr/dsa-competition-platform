import {
  Box,
  Text,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  Button,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import { useState } from "react";

interface LanguageSelectorProps {
  onSelect: (lang: string) => void;
}

const LanguageSelector = ({ onSelect }: LanguageSelectorProps) => {
  const [language, setLanguage] = useState("JavaScript");

  const handleSelect = (lang: string) => {
    setLanguage(lang);
    onSelect(lang);
  };

  return (
    <Box display="flex" alignItems="center" gap={3} mb={4} ml={2}>
      <Text fontWeight="medium" color="gray.100">
        Language:
      </Text>

      <MenuRoot>
        <MenuTrigger asChild>
          <Button variant="outline" colorPalette="blue">
            <HStack gap={2}>
              <Text>{language}</Text>
              <Icon as={ChevronDownIcon} boxSize={4} />
            </HStack>
          </Button>
        </MenuTrigger>

        <MenuContent bg="white" border="1px solid" borderColor="gray.200">
          {["C", "C++", "Java", "Python", "JavaScript"].map((lang) => (
            <MenuItem
              key={lang}
              value={lang}
              onClick={() => handleSelect(lang)}
              bg={language === lang ? "blue.600" : "white"}
              color={language === lang ? "white" : "gray.800"} 
              _hover={{
                bg: language === lang ? "blue.700" : "gray.100",
                color: language === lang ? "white" : "black",
              }}
            >
              <HStack justify="space-between" w="full">
                <Text>{lang}</Text>
                {language === lang && <Icon as={CheckIcon} boxSize={4} />}
              </HStack>
            </MenuItem>
          ))}
        </MenuContent>
      </MenuRoot>
    </Box>
  );
};

export default LanguageSelector;
