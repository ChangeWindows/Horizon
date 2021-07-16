<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $patreon_api = new \Patreon\API(env('PATREON_API_KEY'));

        $campaign_id = 1028298;

        $fields = [
            "page" => [
                "size" => 100
            ],
            "include" => implode(",",[
                "user"
            ]),
            "fields" => [
                "member" => implode(",",[
                    "full_name",
                    "patron_status"
                ])
            ]
        ];
        $query = http_build_query($fields);

        $pledges_response = $patreon_api->get_data("campaigns/{$campaign_id}/members?{$query}");
        $patrons = collect();

        foreach (array_keys($pledges_response['data']) as $pledge_data_key) {
            $pledge_data = $pledges_response['data'][$pledge_data_key];

            if ($pledge_data['attributes']['patron_status'] === 'active_patron') {
                $patrons->push([
                    'name' => $pledge_data['attributes']['full_name'],
                    'avatar' => "https://c8.patreon.com/2/200/{$pledge_data['relationships']['user']['data']['id']}"
                ]);
            }
        }

        return Inertia::render('Settings/Index', [
            'patrons' => $patrons
        ]);
    }
}
