import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { target, params } = await req.json();

    if (target === "TAU") {
      const { bagrut, psycho } = params;
      const tauData = {
        operationName: "getLastScore",
        variables: {
          scoresData: {
            prog: "calctziun",
            out: "json",
            reali10: 1,
            psicho: psycho,
            bagrut: bagrut,
          },
        },
        query: `query getLastScore($scoresData: JSON!) {\n  getLastScore(scoresData: $scoresData) {\n    body\n    __typename\n  }\n}\n`,
      };

      const resp = await fetch("https://go.tau.ac.il/graphql", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(tauData),
      });
      const text = await resp.text();
      
      // Parse TAU response
      try {
        const parsed = JSON.parse(text);
        const body = parsed?.data?.getLastScore?.body;
        if (body && body.hatama_refua !== undefined) {
          return new Response(JSON.stringify({ sechem: body.hatama_refua }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch {
        // fall through
      }
      return new Response(JSON.stringify({ sechem: null, raw: text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (target === "BGU_BAGRUT") {
      const { bagrut, psycho } = params;
      const url = `https://bgucr4u.bgu.ac.il/ords/sc/calculators/GetSekem?p_bagrut_average=${bagrut}&p_psychometry=${psycho}&`;
      const resp = await fetch(url, {
        method: "GET",
        headers: { "Content-type": "application/x-www-form-urlencoded" },
      });
      const text = await resp.text();
      try {
        const parsed = JSON.parse(text);
        return new Response(JSON.stringify({ sechem: parsed.p_final_sekem }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        return new Response(JSON.stringify({ sechem: null, raw: text }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (target === "BGU_PREP") {
      const { prep, psycho } = params;
      const url = `https://bgucr4u.bgu.ac.il/ords/sc/calculators/GetSekemPrep/?p_prep_average=${prep}&p_prep_psychometry=${psycho}&`;
      const resp = await fetch(url, {
        method: "GET",
        headers: { "Content-type": "application/x-www-form-urlencoded" },
      });
      const text = await resp.text();
      try {
        const parsed = JSON.parse(text);
        return new Response(JSON.stringify({ sechem: parsed.p_sekem_prep }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        return new Response(JSON.stringify({ sechem: null, raw: text }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Unknown target" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
