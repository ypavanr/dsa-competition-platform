import { ChakraProvider, Box } from "@chakra-ui/react";
import { system } from "../components/theme";
import CodeEditor from "../components/CodeEditor";
function Problem1() {
  return (
    <ChakraProvider value={system}>
      <Box
        minH="100vh"
        bg="#0f0a19"
        color="gray.200"
        px={6}
        py={8}
        textAlign="center"
      >
          <CodeEditor/>
      </Box>
    </ChakraProvider>
  );
}

export default Problem1;
