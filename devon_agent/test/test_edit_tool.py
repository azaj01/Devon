command = """edit_file
<<<
--- translator.py
+++ translator.py
@@ -0,0 +1,20 @@
+from transformers import MarianMTModel, MarianTokenizer
+
+def translate(text, src_lang="en", tgt_lang="fr"):
+    model_name = f'Helsinki-NLP/opus-mt-{src_lang}-{tgt_lang}'
+    tokenizer = MarianTokenizer.from_pretrained(model_name)
+    model = MarianMTModel.from_pretrained(model_name)
+
+    translated = model.generate(**tokenizer(text, return_tensors="pt", padding=True))
+    tgt_text = [tokenizer.decode(t, skip_special_tokens=True) for t in translated]
+
+    return tgt_text[0]
+
+if __name__ == "__main__":
+    text_to_translate = "Hello, how are you?"
+    translated_text = translate(text_to_translate)
+    print(f"Original text: {text_to_translate}")
+    print(f"Translated text: {translated_text}")
+
+    # Add more test cases if needed
+    # print(translate("This is a test."))
>>>"""
